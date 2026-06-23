-- ============================================================================
-- APN Hub — sample seed data
-- ----------------------------------------------------------------------------
-- Run AFTER 0001_initial_schema.sql. Everything is inserted as 'published'
-- (or 'approved' for prayers) so the app looks populated right away.
-- The same data set is mirrored in src/lib/sample-data.ts for the no-database
-- fallback / preview mode.
-- ============================================================================

-- Categories -----------------------------------------------------------------
insert into public.categories (name, type) values
  ('Revival','event'),('Youth Rally','event'),('Conference','event'),
  ('Camp Meeting','event'),('Music','event'),('Prayer','event'),
  ('Bible Study','event'),('Special Service','event'),
  ('Baptism in Jesus'' Name','preaching'),('Holy Ghost','preaching'),
  ('Oneness of God','preaching'),('Prayer','preaching'),('Holiness','preaching'),
  ('Worship','preaching'),('Revival','preaching'),('Apostolic Identity','preaching'),
  ('Evangelism','preaching'),
  ('Bible Study Lessons','material'),('New Convert Lessons','material'),
  ('Doctrine Sheets','material'),('Prayer Guides','material'),
  ('Youth Lessons','material'),('Sunday School','material'),
  ('Outreach Flyers','material'),('Sermon Notes','material'),
  ('Family Devotionals','material'),('Church Media Templates','material'),
  ('Healing','prayer'),('Family','prayer'),('Direction','prayer'),
  ('Salvation','prayer'),('Revival','prayer'),('Church','prayer'),
  ('Urgent','prayer'),('Other','prayer')
on conflict do nothing;

-- Events ---------------------------------------------------------------------
insert into public.events (title, description, event_date, event_time, city, state, church_name, speaker, category, source_url, contact_email, status) values
  ('Arkansas Youth Rally','A powerful night of worship and preaching for apostolic youth across the region.', '2026-07-12','7:00 PM','Little Rock','AR','First Apostolic Church','Rev. D. Mitchell','Youth Rally','https://example.com/youth-rally','info@firstapostolic.org','published'),
  ('Revival Weekend','Three nights of revival — preaching, worship, and prayer for an outpouring.', '2026-07-19','7:30 PM','Dallas','TX','Pentecostals of Dallas','Pastor J. Reyes','Revival','https://example.com/revival','revival@podallas.org','published'),
  ('Apostolic Music Night','An evening of anointed apostolic worship and special music.', '2026-07-26','6:00 PM','Memphis','TN','Holy Ghost Temple','Worship & Praise','Music','https://example.com/music-night','music@hgtemple.org','published'),
  ('Summer Camp Meeting','A week of family camp meeting with daily services and youth activities.', '2026-08-04','10:00 AM','Tulsa','OK','Apostolic Tabernacle','Multiple Speakers','Camp Meeting','https://example.com/camp','camp@apostolictab.org','published'),
  ('Regional Apostolic Conference','Two days of teaching for pastors, leaders, and saints.', '2026-08-15','9:00 AM','Baton Rouge','LA','Christ Apostolic Center','Bishop A. Carter','Conference','https://example.com/conference','events@cacenter.org','published');

-- Preaching ------------------------------------------------------------------
insert into public.preaching_items (title, speaker, topic, scripture_reference, description, media_url, media_type, status) values
  ('Buried With Him in Baptism','Rev. D. Mitchell','Baptism in Jesus'' Name','Acts 2:38','The biblical pattern of water baptism in the name of Jesus Christ.','https://example.com/sermon1','video','published'),
  ('Receiving the Promise','Pastor J. Reyes','Holy Ghost','Acts 2:1-4','How to receive the gift of the Holy Ghost with the evidence of speaking in tongues.','https://example.com/sermon2','video','published'),
  ('One God Revealed','Bishop A. Carter','Oneness of God','Colossians 2:9','Understanding the mighty God in Christ — one God, revealed in Jesus.','https://example.com/sermon3','audio','published'),
  ('A Praying Church','Sis. R. Daniels','Prayer','1 Thessalonians 5:17','How a praying church becomes a moving, growing church.','https://example.com/sermon4','video','published'),
  ('Set Apart','Pastor M. Alvarez','Holiness','1 Peter 1:16','Practical holiness for everyday apostolic living.','https://example.com/sermon5','audio','published'),
  ('Enter His Presence','Worship Team','Worship','Psalm 100:4','Entering His presence through anointed apostolic worship.','https://example.com/sermon6','video','published');

-- Podcast --------------------------------------------------------------------
insert into public.podcast_episodes (title, episode_number, guest, description, duration, media_url, status) values
  ('The Apostolic Life', 42, 'Pastor M. Alvarez','Staying faithful while traveling in ministry.','52 min','https://example.com/ep42','published'),
  ('Revival Conversations', 41, 'Evang. T. Brooks','What it takes to see revival in your city.','47 min','https://example.com/ep41','published'),
  ('Doctrine That Matters', 40, 'Dr. L. Crane','Why apostolic doctrine still matters today.','61 min','https://example.com/ep40','published'),
  ('Stories From the Pew', 39, 'Sis. R. Daniels','Testimonies of God''s faithfulness from everyday saints.','38 min','https://example.com/ep39','published');

-- Materials ------------------------------------------------------------------
insert into public.materials (title, category, description, file_type, file_url, is_premium, status) values
  ('Why We Baptize in Jesus'' Name','Doctrine Sheets','A clear, scriptural explanation perfect for new converts and seekers.','PDF','https://example.com/baptism.pdf', false,'published'),
  ('30-Day New Convert Guide','New Convert Lessons','A daily devotional path to ground new believers in the faith.','PDF','https://example.com/newconvert.pdf', false,'published'),
  ('Home Bible Study — Lesson 1','Bible Study Lessons','An editable, easy-to-teach lesson for one-on-one home studies.','DOC','https://example.com/lesson1.doc', false,'published'),
  ('Prayer & Fasting Guide','Prayer Guides','A 21-day guided plan with scriptures, prompts, and journaling space.','PDF','https://example.com/prayer-fasting.pdf', false,'published'),
  ('Youth Night Lesson Pack','Youth Lessons','Editable slides, graphics, and discussion guides for youth services.','Canva','https://example.com/youth-pack', false,'published'),
  ('Outreach Follow-Up Card','Outreach Flyers','A printable, editable card to follow up with first-time visitors.','Canva','https://example.com/followup', false,'published');

-- Prayer requests ------------------------------------------------------------
insert into public.prayer_requests (name, title, request_text, category, city, state, is_public, prayer_count, status) values
  ('Maria','Pray for healing','Believing God for a full healing for my mother this week.','Healing','Houston','TX', true, 24,'approved'),
  (null,'Pray for my family','Asking for unity and salvation for my whole household.','Family',null,null, true, 41,'approved'),
  ('James','Pray for direction','Seeking God''s will for a big decision coming up. Thank you saints.','Direction','Little Rock','AR', true, 18,'approved'),
  (null,'Pray for revival in my city','Crying out for an outpouring of the Spirit across our city.','Revival','Memphis','TN', true, 63,'approved');

-- Admin user (replace email with your own) -----------------------------------
insert into public.admin_users (email, role) values
  ('you@example.com','admin')
on conflict do nothing;
