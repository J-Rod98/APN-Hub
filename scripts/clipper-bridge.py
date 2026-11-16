#!/usr/bin/env python3
"""Bridge owner-approved tasks into APN Clipper's existing scheduler.
Does not download, transcribe, render, post, replace config or change launchd.
Run with the clipper's Python environment to import its existing publisher.
"""
import argparse, contextlib, datetime, fcntl, hashlib, json, os, sys, urllib.request
from pathlib import Path


def fingerprint(manifest, media):
    h = hashlib.sha256(manifest.read_bytes())
    with media.open("rb") as f:
        for block in iter(lambda: f.read(1024 * 1024), b""):
            h.update(block)
    return h.hexdigest()


def inventory(root):
    out = (root / "out").resolve()
    found = []
    for manifest in sorted(out.glob("*/*/manifest.json")):
        m = json.loads(manifest.read_text())
        for clip in m.get("clips", []):
            media = (manifest.parent / clip["file"]).resolve()
            if not media.is_relative_to(out) or not media.is_file():
                continue
            key = media.relative_to(out).as_posix()
            text = json.dumps({"source_title": m.get("title"), "credit": m.get("preacher") or m.get("channel"), "source_url": m.get("url"), "start": clip.get("start"), "end": clip.get("end"), "clip_title": clip.get("title"), "existing_captions": clip.get("captions"), "copyright_flag": m.get("copyright_flag"), "note": "Clipper metadata only. No sermon transcript is retained. Do not reconstruct quotations or teaching from this metadata."}, ensure_ascii=False)
            found.append({"title": clip["title"], "url": m["url"], "kind": "clip_manifest", "text": text, "rights": "unknown", "rightsEvidence": "", "copyrightFlag": bool(m.get("copyright_flag")), "verifiedAt": datetime.datetime.now(datetime.timezone.utc).isoformat(), "clipKey": key, "manifestHash": fingerprint(manifest, media)})
    return found


def call_api(endpoint, token, body=None, view=""):
    if not endpoint.startswith("https://") and not endpoint.startswith(("http://127.0.0.1:", "http://localhost:")):
        raise RuntimeError("Use HTTPS or a loopback local test endpoint.")
    url = endpoint.rstrip("/") + "/api/apn-agents" + view
    data = None if body is None else json.dumps(body).encode()
    req = urllib.request.Request(url, data=data, headers={"Authorization": "Bearer " + token, "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as response:
        return json.load(response)


def atomic_json(path, data):
    temp = path.with_suffix(".tmp")
    temp.write_text(json.dumps(data, indent=2))
    temp.chmod(0o600)
    temp.replace(path)


def sync(root, endpoint, token):
    sys.path.insert(0, str(root))
    import clipper
    import publisher
    if not hasattr(publisher, "queue_transaction"):
        raise RuntimeError("Apply the reviewed publisher queue-lock patch before enabling bridge writes. Inventory remains available.")
    directory = root / "data"
    with contextlib.ExitStack() as stack:
        lock = stack.enter_context((directory / "apn-agent-bridge.lock").open("a+"))
        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        stack.enter_context(publisher.queue_transaction())
        ledger_path = directory / "apn-agent-bridge.json"
        ledger = json.loads(ledger_path.read_text()) if ledger_path.exists() else {}
        jobs = call_api(endpoint, token, view="?view=clipper")["jobs"]
        items = {s["clipKey"]: s for s in inventory(root)} if jobs else {}
        for job in jobs:
            old = ledger.get(job["id"])
            if old and old["hash"] != job["hash"]:
                raise RuntimeError("Approval changed; manual reconciliation required.")
            if not old or old["status"] != "scheduled":
                item = items.get(job["clipKey"])
                if not item or item["manifestHash"] != job["manifestHash"]:
                    raise RuntimeError("Approved media or manifest changed; owner must review it again.")
                queue = publisher.load_queue()
                existing = next((q for q in queue if q["key"] == job["clipKey"]), None)
                if existing:
                    if existing.get("apn_approval_id") != job["id"] or existing.get("apn_approval_hash") != job["hash"]:
                        raise RuntimeError("Clip already belongs to the existing queue. No duplicate was scheduled; reconcile ownership manually.")
                    entry = existing
                else:
                    ledger[job["id"]] = {"hash": job["hash"], "status": "started"}
                    atomic_json(ledger_path, ledger)
                    # Reuse original copyright confirmation and free-slot logic.
                    entry = publisher.approve(job["clipKey"], clipper.load_config(), ack_copyright=bool(job.get("copyrightAcknowledged")))
                    queue = publisher.load_queue()
                    entry = next(q for q in queue if q["key"] == job["clipKey"])
                    entry.update(caption=job["caption"], apn_approval_id=job["id"], apn_approval_hash=job["hash"])
                    publisher.save_queue(queue)
                receipt = job["clipKey"] + " @ " + entry["scheduled_at"]
                ledger[job["id"]] = {"hash": job["hash"], "status": "scheduled", "receipt": receipt}
                atomic_json(ledger_path, ledger)
            call_api(endpoint, token, {"action": "clipper-receipt", "id": job["id"], "hash": job["hash"], "receipt": ledger[job["id"]]["receipt"]})
            print("Scheduled approved task " + job["id"] + " with the existing publisher.")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=["inventory", "register", "sync"])
    parser.add_argument("--root", type=Path, default=Path.home() / "apn-clipper")
    parser.add_argument("--clip-key")
    parser.add_argument("--rights-evidence", default="")
    args = parser.parse_args()
    root = args.root.resolve()
    if args.command == "inventory":
        print(json.dumps(inventory(root), indent=2))
        return
    endpoint = os.environ.get("APN_AGENT_URL", "")
    token = os.environ.get("APN_OWNER_TOKEN", "")
    if not endpoint or len(token) < 32:
        raise RuntimeError("Configure APN_AGENT_URL and APN_OWNER_TOKEN securely before using the bridge.")
    if args.command == "register":
        if len(args.rights_evidence.strip()) < 15:
            raise RuntimeError("Document permission for this exact use before registering a source.")
        source = next((s for s in inventory(root) if s["clipKey"] == args.clip_key), None)
        if not source:
            raise RuntimeError("Clip not found.")
        source.update(rights="permission", rightsEvidence=args.rights_evidence)
        result = call_api(endpoint, token, {"action": "source", "source": source})
        print("Registered source " + result["id"] + "; create a clip task, then review it in the owner dashboard.")
    else:
        sync(root, endpoint, token)


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print("Bridge stopped: " + str(error), file=sys.stderr)
        sys.exit(1)
