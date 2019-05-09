<?php namespace October\Test\Updates;

use October\Test\Models\Page;
use October\Test\Models\User;
use October\Test\Models\Role;
use October\Test\Models\Post;
use October\Test\Models\Tag;
use October\Test\Models\Phone;
use October\Test\Models\Person;
use October\Test\Models\Review;
use October\Test\Models\Plugin;
use October\Test\Models\Gallery;
use October\Test\Models\Theme;
use October\Test\Models\Country;
use October\Test\Models\Channel;
use October\Test\Models\Member;
use October\Test\Models\Category;
use October\Test\Models\Attribute;
use October\Rain\Database\Updates\Seeder;

class SeedAllTables extends Seeder
{

    public function run()
    {
        /*
         * Test 1: People
         */

        $person = Person::create(['name' => 'Eddie Valiant', 'bio' => 'I have a phone set up already', 'expenses'=> 19999, 'favcolor' => '#5fb6f5']);
        $person->phone = Phone::create(['name' => 'Mobile', 'number' => '(360) 733-2263']);
        $person->alt_phone = Phone::create(['name' => 'Home', 'number' => '(360) 867-3563']);
        $person->save();

        Person::create(['name' => 'Baby Herman', 'bio' => 'I have nothing at all', 'favcolor' => '#990000']);
        Phone::create(['name' => 'Work', 'number' => '(360) 595-2146']);
        Phone::create(['name' => 'Fax', 'number' => '(360) 595-2146']);
        Phone::create(['name' => 'Inactive', 'number' => '(xxx) xxx-xxx', 'is_active' => false]);

        Person::create(['name' => 'Jon Doe', 'bio' => 'I like turtles', 'favcolor' => '#111111']);
        Person::create(['name' => 'John Smith', 'bio' => 'I like dolphins', 'favcolor' => '#222222']);
        Person::create(['name' => 'Jon Smith', 'bio' => 'I like snakes', 'favcolor' => '#333333']);
        Person::create(['name' => 'Mary Smith', 'bio' => 'I like fish', 'favcolor' => '#444444']);

        /*
         * Test 2: Posts
         */

        $post = Post::create(['name' => 'First post, yay!', 'content' => 'I have some comments!' ]);
        Post::create(['name' => 'A lonely toon', 'content' => 'I have nothing at all' ]);

        $post->comments()->create([
            'name' => 'deadmau5',
            'content' => 'Hai fwiend, hai fwiend, hai fwiend, hai fwiend, hai fwiend. Brrrrrup bloop. Brrrrrp bloop. Brrrrrp bloop. Brrrrrp bloop.'
        ]);

        $post->comments()->create([
            'name' => 'Hidden comment',
            'content' => 'This comment should be hidden as defined in the relationship.',
            'is_visible' => false
        ]);

        /*
         * Test 3: Users
         */

        User::make(['username' => 'Neo', 'security_code' => '1111'])->forceSave();
        User::make(['username' => 'Morpheus', 'security_code' => '8888'])->forceSave();

        $role = Role::create(['name' => 'Chief Executive Orangutan', 'description' => 'You can call this person CEO for short']);
        Role::create(['name' => 'Chief Friendship Organiser', 'description' => 'You can call this person CFO for short']);
        Role::create(['name' => 'Caring Technical Officer', 'description' => 'You can call this person CTO for short']);

        $user = User::first();
        $user->roles()->add($role, null, ['clearance_level' => 'Top Secret', 'is_executive' => true]);

        /*
         * Test 4: Countries
         */
        Country::create([
            'name' => 'Petoria',
            'code' => 'petoria',
            'language' => 'eh',
            'currency' => 'btc',
            'is_active' => false,
            'states' => [
                ['title' => 'Stewie'],
                ['title' => 'Brian'],
                ['title' => 'Chris'],
                ['title' => 'Lois'],
                ['title' => 'Meg'],
            ]
        ]);

        Country::create([
            'name' => 'Blueseed',
            'code' => 'blueseed',
            'language' => 'bs',
            'currency' => 'btc',
            'is_active' => false,
            'states' => [
                ['title' => 'Boaty'],
                ['title' => 'McBoat'],
                ['title' => 'Face'],
            ]
        ]);

        /*
         * Test 5: Reviews
         */

        Review::create(['content' => 'Orphan review', 'is_positive' => false]);
        $review = Review::create(['content' => 'Excellent design work', 'is_positive' => true]);

        $theme = Theme::create(['name' => 'Bootstrap', 'code' => 'bootstrap', 'content' => 'A bootstrap theme.']);
        $theme->reviews()->add($review);

        Plugin::create(['name' => 'Angular', 'code' => 'angular', 'content' => 'An AngularJS plugin.']);

        /*
         * Test 6: Galleries
         */

        $gallery = Gallery::create(['title' => 'Featured']);
        $gallery->posts()->add(Post::first());

        /*
         * Test 7: Trees
         */

        $fourUpManager = Member::create(['name' => 'Khaleesi']);
        $threeUpManager = Member::create(['name' => 'Ian', 'parent_id' => $fourUpManager->id]);
        $twoUpManager = Member::create(['name' => 'Vangelis', 'parent_id' => $threeUpManager->id]);
        $oneUpManager = Member::create(['name' => 'Joe', 'parent_id' => $twoUpManager->id]);
        Member::create(['name' => 'Johnny', 'user_id' => $user->id, 'parent_id' => $oneUpManager->id]);
        Member::create(['name' => 'Sally', 'user_id' => $user->id, 'parent_id' => $oneUpManager->id]);
        Member::create(['name' => 'Rick', 'user_id' => $user->id, 'parent_id' => $oneUpManager->id]);

        $orange = Channel::create(['title' => 'Channel Orange', 'description' => 'A root level forum channel', 'user_id' => $user->id]);
        $autumn = $orange->children()->create(['title' => 'Autumn Leaves', 'description' => 'Disccusion about the season of falling leaves.']);
        $autumn->children()->create(['title' => 'September', 'description' => 'The start of the fall season.']);
        $october = $autumn->children()->create(['title' => 'October', 'description' => 'The middle of the fall season.']);
        $autumn->children()->create(['title' => 'November', 'description' => 'The end of the fall season.']);
        $orange->children()->create(['title' => 'Summer Breeze', 'description' => 'Disccusion about the wind at the ocean.']);

        $green = Channel::create(['title' => 'Channel Green', 'description' => 'A root level forum channel', 'user_id' => $user->id]);
        $green->children()->create(['title' => 'Winter Snow', 'description' => 'Disccusion about the frosty snow flakes.']);
        $green->children()->create(['title' => 'Spring Trees', 'description' => 'Disccusion about the blooming gardens.']);

        $parent = Category::create(['name' => 'Web', 'description' => 'Websites & Web Applications']);
        Category::create(['name' => 'Create a website', 'parent_id' => $parent->id]);
        Category::create(['name' => 'Convert a template to a website', 'parent_id' => $parent->id]);

        $parent = Category::create(['name' => 'Desktop', 'description' => 'Desktop Software']);
        Category::create(['name' => 'Write software for Windows', 'parent_id' => $parent->id]);
        Category::create(['name' => 'Write software for Mac', 'parent_id' => $parent->id]);
        Category::create(['name' => 'Write software for Linux', 'parent_id' => $parent->id]);

        $parent = Category::create(['name' => 'Mobile', 'description' => 'Mobile Apps']);
        Category::create(['name' => 'Write software for iPhone / iPad', 'parent_id' => $parent->id]);
        Category::create(['name' => 'Write software for Android', 'parent_id' => $parent->id]);
        Category::create(['name' => 'Create a mobile website', 'parent_id' => $parent->id]);

        /*
         * Test 8: Attributes
         */

        $generalStatus = [
            ['name' => 'Draft', 'code' => 'draft'],
            ['name' => 'Pending', 'code' => 'pending'],
            ['name' => 'Rejected', 'code' => 'rejected'],
            ['name' => 'Active', 'code' => 'active'],
            ['name' => 'Suspended', 'code' => 'suspended'],
            ['name' => 'Expired', 'code' => 'expired'],
            ['name' => 'Cancelled', 'code' => 'cancelled'],
            ['name' => 'Completed', 'code' => 'completed'],
            ['name' => 'Closed', 'code' => 'closed'],
        ];

        $generalTypes = [
            ['name' => 'Warrior', 'label' => 'Tank, Melee Damage Dealer', 'code' => 'warrior'],
            ['name' => 'Paladin', 'label' => 'Tank, Healer, Melee Damage Dealer', 'code' => 'paladin'],
            ['name' => 'Hunter', 'label' => 'Ranged Physical Damage Dealer', 'code' => 'hunter'],
            ['name' => 'Rogue', 'label' => 'Melee Damage Dealer', 'code' => 'rogue'],
            ['name' => 'Priest', 'label' => 'Healer, Ranged Magic Damage Dealer', 'code' => 'priest'],
            ['name' => 'Death Knight', 'label' => 'Tank, Melee Damage Dealer', 'code' => 'death-knight'],
            ['name' => 'Shaman', 'label' => 'Healer, Ranged Magic Damage Dealer, Melee Damage Dealer', 'code' => 'shaman'],
            ['name' => 'Mage', 'label' => 'Ranged Magic Damage Dealer', 'code' => 'mage'],
            ['name' => 'Warlock', 'label' => 'Ranged Magic Damage Dealer', 'code' => 'warlock'],
            ['name' => 'Monk', 'label' => 'Tank, Healer, Melee Damage Dealer', 'code' => 'monk'],
            ['name' => 'Druid', 'label' => 'Tank, Healer, Ranged Magic Damage Dealer, Melee Damage Dealer', 'code' => 'druid'],
            ['name' => 'Demon Hunter', 'label' => 'Melee Damage Dealer, Tank', 'code' => 'demon-hunter'],
        ];

        $map = [
            Attribute::GENERAL_STATUS => $generalStatus,
            Attribute::GENERAL_TYPE => $generalTypes,
        ];

        foreach ($map as $type => $items) {
            foreach ($items as $data) {
                Attribute::create(array_merge($data, ['type' => $type]));
            }
        }

        $pages = [
            [
                'id' => 1,
                'type' => 1,
                'content' => [
                    'title' => 'This is a simple page',
                    'content' => '<h1>Hello, World</h1>'
                ],
            ],
            [
                'id' => 2,
                'type' => 2,
                'content' => [
                    'title' => 'This is a complex page',
                    'content' => '<h1>Hello, Complex World</h1>',
                    'meta_description' => 'Meta Description',
                    'meta_tags' => ['OctoberCMS', 'Fun'],
                    'colors' => [
                        'primary' => '#ff0000',
                        'secondary' => '#00ff00',
                    ]
                ],
            ],
        ];
        foreach($pages as $page) {
            Page::create($page);
        }
    }

}
