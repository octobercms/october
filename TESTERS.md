# Testers

All the admin's working on October CMS are volunteers and have a limited amount of time to spend maintaining this repo.

To help speed things up, it would be most appreciated if the October CMS community could test some pull requests.

Note: It's probably best to try this out on a fresh copy of October to avoid any possible errors.

Here's the steps you can take to test a pull request - you'll need to run these through CLI:

In this example let's say a user called `qwerty123` has created a pull request `4509`.

1. Check out a copy of the October CMS repo to a folder that you can view on the web: git clone `git@github.com:octobercms/october.git` (this will add the files into a folder called `october`.

2. Then, you will want to checkout **@qwerty123**'s changes in a branch: `git fetch origin pull/4509/head:pr-4509`. This will pull their changes into a branch called `pr-4509`. You will then need to checkout the branch: `git checkout pr-4509`

3. Then, go into the folder and get the Composer dependencies: `composer update`

4. Next, run `php artisan october:env` to create a `.env` file in your folder. This will contain the configuration values for the database and site.

5. Once you've populated that file with your database and site details, run `php artisan october:up` to install the necessary database tables.

At this point, you should have a working copy of the pull request ready to test.