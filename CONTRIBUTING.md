# Contributing to OctoberCMS

Thank you for your contributions!

## Reporting a bug with OctoberCMS

**Please don't use the main GitHub for reporting bugs with plugins.** If you have found a bug in a plugin, the best place to report it is with the [plugin author](http://octobercms.com/plugins).

We work hard to process bugs that are reported, to assist with this please ensure the following details are always included:

- **Bug summary**: Make sure your summary reflects what the problem is and where it is.

- **Request location**: Enter the URL where this bug occurs, if applicable.

- **Reproduce steps**: Clearly mention the steps to reproduce the bug.

- **Expected behavior**: How OctoberCMS should behave on above mentioned steps.

- **Actual behavior**: What is the actual result on running above steps i.e. the bug behavior - **include any error messages**.

#### Here's how to report a bug on GitHub

1. **Register for an account on [GitHub](https://github.com),** if you don't already have one.

2. **Search for similar bugs.** Perhaps someone has already reported your issue! If so, please add clarification and/or more information to the **existing** bug.

3. **Create a new bug.** If you don't find any similar issues, you can report your bug via the "new issue" tab once you've logged in.

4. **Monitor your issue and respond to questions.** It may be necessary to provide additional information upon request or you might be asked if the bug still occurs after an update.

5. **Close your bug.** In case you notice that the bug doesn't occur anymore, you can close the issue yourself (don't forget to add a note saying the issue is resolved).

If you find out your bug is actually a duplicate of another bug and only notice that after you created it, please also close your bug with a short reference to the other issue that was there before.

#### Reporting security issues

If you wish to contact us privately about any security exploits in OctoberCMS you may find, you can find our email on the [OctoberCMS website](http://octobercms.com).

## Feature requests

**Please don't use GitHub issues for suggesting a new feature.** If you have a feature idea, the best place to suggest it is the [OctoberCMS website forum](http://octobercms.com/forum/chan/feature-requests).

Only use GitHub if you are planning on contributing a new feature and developing it. If you want to discuss your idea first, before "officially" posting it anywhere, you can always join us on [IRC](http://octobercms.com/chat).

#### GitHub feature requests

Feature Requests submitted as GitHub Issues specifically mean *"I'd like to see this feature, I'm going to be working on some code to implement it."* It is more like a Pre-Pull Request, in which a developer signifies that he or she wants to see a feature implemented that they think would be really great, and they're committed to coding it.

It's a great way to launch discussions on the developer side of things because both the core team and the community developer get a chance to talk about the technical side of the feature implementation. It's a great way to exchange ideas about how the logic could work in code.

## Pull Requests

Your contributions to the project are very welcome. If you would like to fix a bug or propose a new feature, you can submit a Pull Request.

To help us merge your Pull Request, please make sure you follow these points:

1. Describe the problem clearly in the Pull Request description
1. Please make your fix on the `develop` branch. This makes merging much easier.
1. Do not edit compiled asset files such as `october.css` Instead, try to edit the LESS files inside the `less/` directory and then use a compiler.
1. For any change that you make, **please try to also add a test case(s)** in the `tests/unit` directory. This helps us understand the issue and make sure that it will stay fixed forever.

Thank you for your contributions!

#### PSR Coding standards

Also ensure that your Pull Request satisfies the following coding standards:

- [PSR 2 Coding Style Guide](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-2-coding-style-guide.md)
- [PSR 1 Coding Style Guide](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-1-basic-coding-standard.md)
- [PSR 0 Coding Style Guide](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-0.md)

#### Team rules

The October team follows the [developer guidelines](http://octobercms.com/docs/help/developer-guide) as much as possible.

#### Code of conduct

We promise to extend courtesy and respect to everyone opening an issue. We expect anyone using the bug trackers to do the same.

All reported issues to this project are valuable. Please act with respect and avoid demeaning, condescending, racist, sexist and other inappropriate language and conduct. Please ensure comments stay professional and constructive.

#### Escalation process

We do our best to attend to all reported issues. If you have an important issue that requires attention, consider submitting a bounty using the [OctoberCMS Bounty Program](https://www.bountysource.com/teams/october).