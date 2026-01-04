<?php

use Tailor\Models\EntryRecord;

class EntriesFieldModelTest extends PluginTestCase
{
    protected $slugCount = 1;

    public function setUp(): void
    {
        parent::setUp();

        $this->migrateTailor();
    }

    /**
     * testSetBelongsToRelation
     */
    public function testSetBelongsToRelation()
    {
        $post = $this->createPost();
        $author = $this->createAuthor();

        // Test relations
        $this->assertNotEmpty($post->id);
        $this->assertNotEmpty($author->id);
        $this->assertEmpty($post->author);

        // Set author
        $post->author = $author;
        $post->save();

        $this->assertEquals($author->id, $post->author_id);
        $this->assertEquals('Test Author', $post->author->title);

        // Test query
        $relationSql = <<<SQL
select
  *
from
  "xc_unittestauthorf28b6604c"
where
  "xc_unittestauthorf28b6604c"."id" = 1
  and "xc_unittestauthorf28b6604c"."draft_mode" = 1
  and "xc_unittestauthorf28b6604c"."is_version" = ''
  and "xc_unittestauthorf28b6604c"."deleted_at" is null
SQL;

        $this->assertEquals(
            $this->cleanSqlSample($relationSql),
            $this->toSqlWithBindings($post->author()->newQuery())
        );
    }

    /**
     * testSetBelongsToManyRelation
     */
    public function testSetBelongsToManyRelation()
    {
        $post = $this->createPost();
        $category = $this->createCategory();
        $category2 = $this->createCategory();

        // Test relations
        $this->assertNotEmpty($post->id);
        $this->assertNotEmpty($category->id);
        $this->assertNotEmpty($category2->id);
        $this->assertEmpty($post->categories);

        // Set category
        $post->categories()->add($category);
        $post->categories()->add($category2);
        $post->save();

        $this->assertTrue($post->categories->contains($category->id));
        $this->assertTrue($post->categories->contains($category2->id));

        $this->assertEquals(2, $post->categories->count());
        $this->assertEquals('Test Category', $post->categories->first()->title);

        // Test query
        $relationSql = <<<SQL
select
  *
from
  "xc_unittestcategoryb022a74bc"
  inner join "xc_unittestpostedcd102ej" on "xc_unittestcategoryb022a74bc"."id" = "xc_unittestpostedcd102ej"."relation_id"
where
  "xc_unittestpostedcd102ej"."parent_id" = 1
  and "xc_unittestpostedcd102ej"."relation_type" = 'Tailor\Models\EntryRecord@xc_unittestcategoryb022a74bc'
  and "xc_unittestpostedcd102ej"."field_name" = 'categories'
  and "xc_unittestcategoryb022a74bc"."draft_mode" = 1
  and "xc_unittestcategoryb022a74bc"."is_version" = ''
  and "xc_unittestcategoryb022a74bc"."deleted_at" is null
  order by "nest_left" asc
SQL;

        $this->assertEquals(
            $this->cleanSqlSample($relationSql),
            $this->toSqlWithBindings($post->categories())
        );

        $post2 = $this->createPost();
        $post2->categories()->add($category2);
        $post2->save();

        $this->assertEquals(2, $category2->posts->count());

        // Test query
        $relationSql = <<<SQL
select
  *
from
  "xc_unittestpostedcd102ec"
  inner join "xc_unittestpostedcd102ej" on "xc_unittestpostedcd102ec"."id" = "xc_unittestpostedcd102ej"."parent_id"
where
  "xc_unittestpostedcd102ej"."relation_id" = 1
  and "xc_unittestpostedcd102ej"."relation_type" = 'Tailor\Models\EntryRecord@xc_unittestcategoryb022a74bc'
  and "xc_unittestpostedcd102ej"."field_name" = 'categories'
  and "xc_unittestpostedcd102ec"."draft_mode" = 1
  and "xc_unittestpostedcd102ec"."is_version" = ''
  and "xc_unittestpostedcd102ec"."deleted_at" is null
  order by "published_at_date" desc
SQL;

        $this->assertEquals(
            $this->cleanSqlSample($relationSql),
            $this->toSqlWithBindings($category->posts())
        );
    }

    /**
     * createPost
     */
    protected function createPost()
    {
        $post = EntryRecord::inSection('UnitTest\Post');
        $post->title = 'Test Post';
        $post->slug = 'post-00' . ++$this->slugCount;
        $post->save();

        // Test schema
        $this->assertEquals([
            'id',
            'site_id',
            'site_root_id',
            'blueprint_uuid',
            'content_group',
            'title',
            'slug',
            'is_enabled',
            'published_at',
            'published_at_date',
            'expired_at',
            'draft_mode',
            'primary_id',
            'primary_attrs',
            'is_version',
            'published_at_day',
            'published_at_month',
            'published_at_year',
            'content',
            'author_id',
            'created_user_id',
            'updated_user_id',
            'deleted_user_id',
            'deleted_at',
            'created_at',
            'updated_at'
        ], Schema::getColumnListing($post->getTable()));

        return $post;
    }

    /**
     * createAuthor
     */
    protected function createAuthor()
    {
        $author = EntryRecord::inSection('UnitTest\Author');
        $author->title = 'Test Author';
        $author->slug = 'author-00' . ++$this->slugCount;
        $author->save();

        $this->assertEquals([
            'id',
            'site_id',
            'site_root_id',
            'blueprint_uuid',
            'content_group',
            'title',
            'slug',
            'is_enabled',
            'published_at',
            'published_at_date',
            'expired_at',
            'draft_mode',
            'primary_id',
            'primary_attrs',
            'is_version',
            'avatar',
            'role',
            'created_user_id',
            'updated_user_id',
            'deleted_user_id',
            'deleted_at',
            'created_at',
            'updated_at'
        ], Schema::getColumnListing($author->getTable()));

        return $author;
    }

    /**
     * createCategory
     */
    protected function createCategory()
    {
        $category = EntryRecord::inSection('UnitTest\Category');
        $category->title = 'Test Category';
        $category->slug = 'category-00' . ++$this->slugCount;
        $category->save();

        // Test schema
        $this->assertEquals([
            'id',
            'site_id',
            'site_root_id',
            'blueprint_uuid',
            'content_group',
            'title',
            'slug',
            'is_enabled',
            'published_at',
            'published_at_date',
            'expired_at',
            'draft_mode',
            'primary_id',
            'primary_attrs',
            'is_version',
            'fullslug',
            'parent_id',
            'nest_left',
            'nest_right',
            'nest_depth',
            'is_featured',
            'description',
            'created_user_id',
            'updated_user_id',
            'deleted_user_id',
            'deleted_at',
            'created_at',
            'updated_at'
        ], Schema::getColumnListing($category->getTable()));

        return $category;
    }

    /**
     * cleanSqlSample
     */
    protected function cleanSqlSample($sql)
    {
        $sql = trim($sql);
        $sql = str_replace("\r\n", ' ', $sql);
        $sql = str_replace("\n", ' ', $sql);
        $sql = preg_replace('/\s+/', ' ', $sql);
        return $sql;
    }

    /**
     * toSqlWithBindings
     */
    protected function toSqlWithBindings($query)
    {
        $bindings = array_map(
            fn ($value) => is_numeric($value) ? $value : "'{$value}'",
            $query->getBindings()
        );

        return Str::replaceArray('?', $bindings, $query->toSql());
    }
}
