<?php

use System\Classes\MailManager;
use System\Models\MailTemplate;
use Illuminate\Mail\Message;
use Symfony\Component\Mime\Email;

class MailManagerTranslateTest extends PluginTestCase
{
    public function setUp(): void
    {
        parent::setUp();

        // Give the primary site a concrete locale so the default locale does not
        // track the active app locale
        \System\Models\SiteDefinition::query()->update(['locale' => 'en']);
        Site::resetCache();

        View::addNamespace('mailtest', __DIR__.'/../fixtures/mail');

        MailManager::instance()->registerMailTemplates([
            'mail.test.welcome' => 'mailtest::welcome'
        ]);

        MailManager::instance()->registerMailPartials([
            'test-partial' => 'mailtest::partial'
        ]);
    }

    public function testMakeLocalizedViewName()
    {
        $manager = MailManager::instance();

        $this->assertEquals(
            'mailtest::fr.welcome',
            self::callProtectedMethod($manager, 'makeLocalizedViewName', ['mailtest::welcome', 'fr'])
        );

        $this->assertEquals(
            'acme.blog::mail.fr.welcome',
            self::callProtectedMethod($manager, 'makeLocalizedViewName', ['acme.blog::mail.welcome', 'fr'])
        );

        $this->assertEquals(
            'system.mail.fr.welcome',
            self::callProtectedMethod($manager, 'makeLocalizedViewName', ['system.mail.welcome', 'fr'])
        );

        $this->assertEquals(
            'fr.welcome',
            self::callProtectedMethod($manager, 'makeLocalizedViewName', ['welcome', 'fr'])
        );
    }

    public function testFindLocalizedView()
    {
        $manager = MailManager::instance();

        $this->assertEquals('mailtest::fr.welcome', $manager->findLocalizedView('mailtest::welcome', 'fr'));

        // Regional locale degrades to the base language
        $this->assertEquals('mailtest::fr.welcome', $manager->findLocalizedView('mailtest::welcome', 'fr-CA'));

        // No localized view available
        $this->assertNull($manager->findLocalizedView('mailtest::welcome', 'de'));

        // Feature disabled
        Config::set('multisite.translate.system_mail_templates', false);
        $this->assertNull($manager->findLocalizedView('mailtest::welcome', 'fr'));
    }

    public function testAddContentLocalizesViewTemplate()
    {
        $message = $this->makeMessage();
        $result = MailManager::instance()->addContentToMailer($message, 'mail.test.welcome', [
            '_current_locale' => 'fr'
        ]);

        $this->assertTrue($result);
        $this->assertEquals('Bienvenue', $message->getSymfonyMessage()->getSubject());
        $this->assertStringContainsString('Bonjour', $message->getSymfonyMessage()->getHtmlBody());
    }

    public function testAddContentDefaultsToBaseTemplate()
    {
        $message = $this->makeMessage();
        $result = MailManager::instance()->addContentToMailer($message, 'mail.test.welcome', []);

        $this->assertTrue($result);
        $this->assertEquals('Welcome', $message->getSymfonyMessage()->getSubject());
        $this->assertStringContainsString('Hello', $message->getSymfonyMessage()->getHtmlBody());
    }

    public function testTemplateCacheKeepsLocalesSeparate()
    {
        $manager = MailManager::instance();

        $message = $this->makeMessage();
        $manager->addContentToMailer($message, 'mail.test.welcome', ['_current_locale' => 'fr']);
        $this->assertEquals('Bienvenue', $message->getSymfonyMessage()->getSubject());

        $message = $this->makeMessage();
        $manager->addContentToMailer($message, 'mail.test.welcome', []);
        $this->assertEquals('Welcome', $message->getSymfonyMessage()->getSubject());
    }

    public function testDbTemplateTranslation()
    {
        $template = MailTemplate::create([
            'code' => 'mail.test.db',
            'subject' => 'Welcome',
            'description' => 'Test template',
            'content_html' => 'Hello',
            'is_custom' => 1
        ]);

        $template->setTranslation('subject', 'fr', 'Bienvenue');
        $template->setTranslation('content_html', 'fr', 'Bonjour');
        $template->save();

        $message = $this->makeMessage();
        MailManager::instance()->addContentToMailer($message, 'mail.test.db', ['_current_locale' => 'fr']);

        $this->assertEquals('Bienvenue', $message->getSymfonyMessage()->getSubject());
        $this->assertStringContainsString('Bonjour', $message->getSymfonyMessage()->getHtmlBody());
    }

    public function testDbTemplateTranslationChain()
    {
        $template = MailTemplate::create([
            'code' => 'mail.test.chain',
            'subject' => 'Welcome',
            'description' => 'Test template',
            'content_html' => 'Hello',
            'is_custom' => 1
        ]);

        $template->setTranslation('subject', 'fr', 'Bienvenue');
        $template->save();

        // Regional locale degrades to the stored base language
        $message = $this->makeMessage();
        MailManager::instance()->addContentToMailer($message, 'mail.test.chain', ['_current_locale' => 'fr-CA']);

        $this->assertEquals('Bienvenue', $message->getSymfonyMessage()->getSubject());
    }

    public function testLocalizedPartialRendering()
    {
        $manager = MailManager::instance();

        self::setProtectedProperty($manager, 'renderLocale', 'fr');
        $this->assertStringContainsString('Partiel FR', $manager->renderPartial('test-partial'));

        self::setProtectedProperty($manager, 'renderLocale', null);
        $this->assertStringContainsString('Partial EN', $manager->renderPartial('test-partial'));
    }

    public function testFeatureDisabledUsesBaseTemplate()
    {
        Config::set('multisite.translate.system_mail_templates', false);

        $message = $this->makeMessage();
        MailManager::instance()->addContentToMailer($message, 'mail.test.welcome', [
            '_current_locale' => 'fr'
        ]);

        $this->assertEquals('Welcome', $message->getSymfonyMessage()->getSubject());
    }

    /**
     * makeMessage builds an empty mail message.
     */
    protected function makeMessage(): Message
    {
        return new Message(new Email);
    }
}
