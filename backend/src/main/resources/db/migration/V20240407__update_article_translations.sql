-- Migration: Update existing articles with English translations
-- Date: 2024-04-07
-- Run this script to add English translations to existing articles

-- Update Article 1: 5 Lợi Ích Sức Khỏe Của Rau Xanh Mỗi Ngày
UPDATE articles SET 
    title_en = '5 Health Benefits of Eating Green Vegetables Daily',
    excerpt_en = 'Green vegetables are rich sources of vitamins and minerals that help boost immunity and prevent many diseases.',
    content_en = '<p>Green vegetables are an essential part of a healthy diet. Here are 5 notable benefits:</p><h2>1. Boost Immune System</h2><p>Green vegetables are rich in vitamin C, vitamin A, and antioxidants that help strengthen immunity.</p><h2>2. Support Digestion</h2><p>Fiber in green vegetables helps the digestive system work better and prevents constipation.</p><h2>3. Reduce Heart Disease Risk</h2><p>Potassium in green vegetables helps regulate blood pressure and protects heart health.</p><h2>4. Control Blood Sugar</h2><p>Green vegetables have a low glycemic index, making them suitable for diabetics.</p><h2>5. Maintain Shape and Beautiful Skin</h2><p>Low in calories but rich in nutrients, green vegetables are the perfect choice for those wanting to lose weight.</p>'
WHERE slug = '5-loi-ich-suc-khoe-cua-rau-xanh';

-- Update Article 2: Cách Chế Biến Nước Ép Trái Cây Tươi Ngon Tại Nhà
UPDATE articles SET 
    title_en = 'How to Make Fresh and Delicious Fruit Juice at Home',
    excerpt_en = 'Learn how to make refreshing and nutritious fruit juices at home with simple recipes.',
    content_en = '<p>Fruit juice is a wonderful way to supplement vitamins and minerals. Lets explore some simple recipes:</p><h2>Orange - Carrot Juice</h2><p>Combine 2 oranges and 1 carrot, put in a juicer and enjoy immediately.</p><h2>Apple - Celery Juice</h2><p>1 apple and 2 celery stalks make a refreshing body detox juice.</p><h2>Watermelon - Mint Juice</h2><p>Cool and refreshing with watermelon and a few fresh mint leaves.</p>'
WHERE slug = 'cach-che-bien-nuoc-ep-trai-cay';

-- Update Article 3: Eat Clean: Chế Độ Ăn Lành Mạnh Cho Người Bận Rộn
UPDATE articles SET 
    title_en = 'Eat Clean: Healthy Diet for Busy People',
    excerpt_en = 'Eat Clean does not have to be complicated. Learn how to eat healthy even when you are very busy with GreenLife.',
    content_en = '<p>Eat Clean is becoming a trend chosen by many people. However, not everyone has time to prepare complex meals.</p><h2>Basic Eat Clean Principles</h2><ul><li>Prioritize fresh, clean, minimally processed foods</li><li>Limit refined sugar and processed foods</li><li>Get enough protein, healthy carbs, and good fats</li><li>Drink enough water every day</li></ul><h2>Tips for Busy People</h2><p>Prepare meal prep on weekends, cook simple meals, and always have healthy snacks on hand.</p>'
WHERE slug = 'eat-clean-cho-nguoi-ban-ron';

-- Update Article 4: Salad Trái Cây: Món Tráng Miệng Ngon Lành Cho Mùa Hè
UPDATE articles SET 
    title_en = 'Fruit Salad: A Healthy Dessert for Summer',
    excerpt_en = 'Fruit salad is not only delicious but also provides plenty of vitamins. Lets cook with GreenLife!',
    content_en = '<p>On hot summer days, nothing beats a refreshing fruit salad topped with a bit of yogurt.</p><h2>Ingredients</h2><ul><li>1 apple</li><li>1 pear</li><li>1 banana</li><li>Red grapes</li><li>Strawberries</li><li>Unsweetened yogurt</li><li>Honey</li></ul><h2>Instructions</h2><p>Wash fruits thoroughly, cut into bite-sized pieces, mix well and add yogurt with honey.</p>'
WHERE slug = 'salad-trai-cay-cho-mua-he';

-- Update Article 5: GreenLife Ra Mắt Dịch Vụ Giao Hàng Tươi Sạch Toàn Quốc
UPDATE articles SET 
    title_en = 'GreenLife Launches Fresh Delivery Service Nationwide',
    excerpt_en = 'GreenLife is pleased to announce that our fresh delivery service is now available in all provinces nationwide.',
    content_en = '<p>GreenLife - Vietnam leading clean food system, officially expands fresh delivery service to all 63 provinces nationwide.</p><h2>GreenLifes Commitment</h2><ul><li>100% organic products, pesticide-free</li><li>Delivery within 24 hours of ordering</li><li>Professional delivery team with refrigerated vehicles</li><li>48-hour return policy if not satisfied</li></ul>'
WHERE slug = 'greenlife-ra-mat-dich-vu-giao-hang';

-- Verify the updates
SELECT id, title, title_en, slug FROM articles ORDER BY id;
