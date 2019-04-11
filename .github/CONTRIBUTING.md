# Contributing to OctoberCMS

Thank you for your interest in contributing to the OctoberCMS project!

## Reporting an issue with OctoberCMS

**Please don't use the main GitHub for reporting issues with plugins.** If you have found a bug in a plugin, the best place to report it is with the [plugin author](https://octobercms.com/plugins).

We work hard to process bugs that are reported, to assist with this please ensure the following details are always included:

- **Summary**: Make sure your summary reflects what the problem is and where it is. Provide as much detail as possible, the more information we have to work with the more likely it is that your problem can be solved.

- **Reproduce steps**: Clearly mention the steps to reproduce the bug.

- **Expected behavior**: Describe how OctoberCMS should behave on above mentioned steps.

- **Actual behavior**: What is the actual result on running above steps i.e. the bug behavior - **include any error messages**.

>**NOTE:** Screenshots and GIFs are very helpful in visuallizing what exactly is going wrong

#### Here's how to report an issue on GitHub

1. **Register for an account on [GitHub](https://github.com),** if you don't already have one.

2. **Search for similar issues.** Perhaps someone has already reported your issue! If so, please add clarification and/or more information to the **existing** issue.

3. **Create a new issue.** If you don't find any similar issues, you can report your issue via the ["issues" tab](https://github.com/octobercms/october/issues) once you've logged in.

4. **Monitor your issue and respond to questions.** It may be necessary to provide additional information upon request or you might be asked if the issue still occurs after an update.

5. **Close your issue.** In case you notice that the issue doesn't occur anymore, you can close the issue yourself (don't forget to add a note saying that the issue is resolved and ideally any additional information on how it was resolved).

If you find out your bug is actually a duplicate of another bug and only notice that after you created it, please also close your bug with a short reference to the other issue that was there before.

#### Reporting security issues

If you wish to contact us privately about any security exploits in OctoberCMS you may find, you can find our email on the [OctoberCMS website](https://octobercms.com).

## Feature requests

**Please don't use GitHub issues for suggesting a new feature.** If you have a feature idea, the best place to suggest it is the [OctoberCMS website forum](https://octobercms.com/forum/chan/feature-requests).

Only use GitHub if you are planning on contributing a new feature and developing it. If you want to discuss your idea first, before "officially" posting it anywhere, you can always join us on [IRC](https://octobercms.com/chat) or [Slack](https://octobercms.slack.com).

#### GitHub feature requests

Feature Requests submitted as GitHub Issues specifically mean *"I'd like to see this feature, I'm going to be working on some code to implement it."* It is more like a Pre-Pull Request, in which a developer signifies that he or she wants to see a feature implemented that they think would be really great, and they're committed to coding it.

It's a great way to launch discussions on the developer side of things because both the core team and the community developer get a chance to talk about the technical side of the feature implementation. It's a great way to exchange ideas about how the logic could work in code.

## Pull Requests

Your contributions to the project are very welcome. If you would like to fix a bug or propose a new feature, you can submit a Pull Request.

To help us merge your Pull Request, please make sure you follow these points:

- Describe the problem clearly in the Pull Request description
- Please make your fix on the `develop` branch. This makes merging much easier.
- Do not edit compiled asset files such as `october.css`, `framework.css`, etc. directly. Instead, edit the LESS files inside the `less/` directory and then run `php artisan october:util compile assets` from the project root and commit the changed LESS files as well as the recompiled asset files.
- For any change that you make, **please also add a test case(s)** in the `tests/unit` directory. This helps us understand the issue and make sure that it will stay fixed forever.

Thank you for your contributions!

#### PSR Coding standards

Please ensure that your Pull Request satisfies the following coding standards:

- [PSR 2 Coding Style Guide](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-2-coding-style-guide.md)
- [PSR 1 Coding Style Guide](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-1-basic-coding-standard.md)
- [PSR 0 Coding Style Guide](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-0.md)

#### Team rules

The October team follows the [developer guidelines](https://octobercms.com/docs/help/developer-guide) as much as possible.

#### Escalation process

We do our best to attend to all reported issues. If you have an important issue that requires attention, consider submitting a bounty using the [OctoberCMS Bounty Program](https://www.bountysource.com/teams/october).