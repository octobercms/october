#!/usr/bin/env bash
#
# git-subsplit.sh: Automate and simplify the process of managing one-way
# read-only subtree splits.
#
# Copyright (C) 2012 Dragonfly Development Inc.
#
# 2020-06-11: Modified by Ben Thomson for October CMS maintenance through GitHub Actions.
#
if [ $# -eq 0 ]; then
    set -- -h
fi
OPTS_SPEC="\
git subsplit init    url
git subsplit publish splits --heads=<heads> --tags=<tags> --splits=<splits>
git subsplit update
--
h,help        show the help
q             quiet
debug         show plenty of debug output
n,dry-run     do everything except actually send the updates
work-dir      directory that contains the subsplit working directory

 options for 'publish'
heads=        only publish for listed heads instead of all heads
no-heads      do not publish any heads
tags=         only publish for listed tags instead of all tags
no-tags       do not publish any tags
update        fetch updates from repository before publishing
rebuild-tags  rebuild all tags (as opposed to skipping tags that are already synced)
path=         path of the repository
"
eval "$(echo "$OPTS_SPEC" | git rev-parse --parseopt -- "$@" || echo exit $?)"

# We can run this from anywhere.
NONGIT_OK=1
DEBUG="  :DEBUG >"

PATH=$PATH:$(git --exec-path)

. git-sh-setup

if [ "$(hash git-subtree &>/dev/null && echo OK)" = "" ]
then
    die "Git subsplit needs git subtree; install git subtree or upgrade git to >=1.7.11"
fi

ANNOTATE=
QUIET=
COMMAND=
SPLITS=
REPO_URL=
WORK_DIR="${PWD}/.subsplit"
HEADS=
NO_HEADS=
TAGS=
NO_TAGS=
REBUILD_TAGS=
DRY_RUN=
VERBOSE=

subsplit_main()
{
    while [ $# -gt 0 ]; do
        opt="$1"
        shift
        case "$opt" in
            -q) QUIET=1 ;;
            --debug) VERBOSE=1 ;;
            --heads) HEADS="$1"; shift ;;
            --no-heads) NO_HEADS=1 ;;
            --tags) TAGS="$1"; shift ;;
            --no-tags) NO_TAGS=1 ;;
            --update) UPDATE=1 ;;
            -n) DRY_RUN="--dry-run" ;;
            --dry-run) DRY_RUN="--dry-run" ;;
            --rebuild-tags) REBUILD_TAGS=1 ;;
            --path) WORK_DIR="$1"; shift ;;
            --) break ;;
            *) die "Unexpected option: $opt" ;;
        esac
    done

    COMMAND="$1"
    shift

    case "$COMMAND" in
        init)
            if [ $# -lt 1 ]; then die "init command requires url to be passed as first argument"; fi
            REPO_URL="$1"
            shift
            subsplit_init
            ;;
        publish)
            if [ $# -lt 1 ]; then die "publish command requires splits to be passed as first argument"; fi
            SPLITS="$1"
            shift
            subsplit_publish
            ;;
        update)
            subsplit_update
            ;;
        *) die "Unknown command '$COMMAND'" ;;
    esac
}
say()
{
    if [ -z "$QUIET" ];
    then
        echo "$@"
    fi
}

subsplit_require_work_dir()
{
    if [ ! -e "$WORK_DIR" ]
    then
        die "Working directory not found at ${WORK_DIR}; please run init first"
    fi

    if [ -n "$VERBOSE" ];
    then
        echo "${DEBUG} pushd \"${WORK_DIR}\" >/dev/null"
    fi

    pushd "$WORK_DIR" >/dev/null
}

subsplit_init()
{
    if [ -e "$WORK_DIR" ]
    then
        die "Working directory already found at ${WORK_DIR}; please remove or run update"
    fi

    say "Initializing subsplit from origin (${REPO_URL})"

    if [ -n "$VERBOSE" ];
    then
        echo "${DEBUG} git clone -q \"${REPO_URL}\" \"${WORK_DIR}\""
    fi

    git clone -q "$REPO_URL" "$WORK_DIR" || die "Could not clone repository"
}

subsplit_publish()
{
    subsplit_require_work_dir

    if [ -n "$UPDATE" ];
    then
        subsplit_update
    fi

    if [ -z "$HEADS" ] && [ -z "$NO_HEADS" ]
    then
        # If heads are not specified and we want heads, discover them.
        HEADS="$(git ls-remote origin 2>/dev/null | grep "refs/heads/" | cut -f3- -d/)"

        if [ -n "$VERBOSE" ];
        then
            echo "${DEBUG} HEADS=\"${HEADS}\""
        fi
    fi

    if [ -z "$TAGS" ] && [ -z "$NO_TAGS" ]
    then
        # If tags are not specified and we want tags, discover them.
        TAGS="$(git ls-remote origin 2>/dev/null | grep -v "\^{}" | grep "refs/tags/" | cut -f3 -d/)"

        if [ -n "$VERBOSE" ];
        then
            echo "${DEBUG} TAGS=\"${TAGS}\""
        fi
    fi

    for SPLIT in $SPLITS
    do
        SUBPATH=$(echo "$SPLIT" | cut -f1 -d:)
        REMOTE_URL=$(echo "$SPLIT" | cut -f2- -d:)
        REMOTE_NAME=$(echo "$SPLIT" | git hash-object --stdin)

        if [ -n "$VERBOSE" ];
        then
            echo "${DEBUG} SUBPATH=${SUBPATH}"
            echo "${DEBUG} REMOTE_URL=${REMOTE_URL}"
            echo "${DEBUG} REMOTE_NAME=${REMOTE_NAME}"
        fi

        if ! git remote | grep "^${REMOTE_NAME}$" >/dev/null
        then
            git remote add "$REMOTE_NAME" "$REMOTE_URL"

            if [ -n "$VERBOSE" ];
            then
                echo "${DEBUG} git remote add \"${REMOTE_NAME}\" \"${REMOTE_URL}\""
            fi
        fi


        say "Syncing ${SUBPATH} -> ${REMOTE_URL}"

        for HEAD in $HEADS
        do
            if [ -n "$VERBOSE" ];
            then
                echo "${DEBUG} git show-ref --quiet --verify -- \"refs/remotes/origin/${HEAD}\""
            fi

            if ! git show-ref --quiet --verify -- "refs/remotes/origin/${HEAD}"
            then
                say " - skipping head '${HEAD}' (does not exist)"
                continue
            fi
            LOCAL_BRANCH="${REMOTE_NAME}-branch-${HEAD}"

            if [ -n "$VERBOSE" ];
            then
                echo "${DEBUG} LOCAL_BRANCH=\"${LOCAL_BRANCH}\""
            fi

            say " - syncing branch '${HEAD}'"

            git checkout master >/dev/null 2>&1
            git branch -D "$LOCAL_BRANCH" >/dev/null 2>&1
            git branch -D "${LOCAL_BRANCH}-checkout" >/dev/null 2>&1
            git checkout -b "${LOCAL_BRANCH}-checkout" "origin/${HEAD}" >/dev/null 2>&1
            git subtree split -q --prefix="$SUBPATH" --branch="$LOCAL_BRANCH" "origin/${HEAD}" >/dev/null 2>&1
            RETURNCODE=$?

            if [ -n "$VERBOSE" ];
            then
                echo "${DEBUG} git checkout master >/dev/null 2>&1"
                echo "${DEBUG} git branch -D \"$LOCAL_BRANCH\" >/dev/null 2>&1"
                echo "${DEBUG} git branch -D \"${LOCAL_BRANCH}-checkout\" >/dev/null 2>&1"
                echo "${DEBUG} git checkout -b \"${LOCAL_BRANCH}-checkout\" \"origin/${HEAD}\" >/dev/null 2>&1"
                echo "${DEBUG} git subtree split -q --prefix=\"$SUBPATH\" --branch=\"$LOCAL_BRANCH\" \"origin/${HEAD}\" >/dev/null 2>&1"
            fi

            if [ $RETURNCODE -eq 0 ]
            then
                PUSH_CMD="git push -q ${DRY_RUN} --force $REMOTE_NAME ${LOCAL_BRANCH}:${HEAD}"

                if [ -n "$VERBOSE" ];
                then
                    echo "${DEBUG} $PUSH_CMD"
                fi

                if [ -n "$DRY_RUN" ]
                then
                    echo \# $PUSH_CMD
                    $PUSH_CMD
                else
                    $PUSH_CMD
                fi

                PUSHRETURNCODE=$?
                if [ $PUSHRETURNCODE -eq 0 ]
                then
                    say " - completed"
                fi
            fi
        done

        for TAG in $TAGS
        do
            if [ -n "$VERBOSE" ];
            then
                echo "${DEBUG} git show-ref --quiet --verify -- \"refs/tags/${TAG}\""
            fi

            if ! git show-ref --quiet --verify -- "refs/tags/${TAG}"
            then
                say " - skipping tag '${TAG}' (does not exist)"
                continue
            fi
            LOCAL_TAG="${REMOTE_NAME}-tag-${TAG}"

            if [ -n "$VERBOSE" ];
            then
                echo "${DEBUG} LOCAL_TAG="${LOCAL_TAG}""
            fi

            if git branch | grep "${LOCAL_TAG}$" >/dev/null && [ -z "$REBUILD_TAGS" ]
            then
                say " - skipping tag '${TAG}' (already synced)"
                continue
            fi

            if [ -n "$VERBOSE" ];
            then
                echo "${DEBUG} git branch | grep \"${LOCAL_TAG}$\" >/dev/null && [ -z \"${REBUILD_TAGS}\" ]"
            fi

            say " - syncing tag '${TAG}'"
            say " - deleting '${LOCAL_TAG}'"
            git branch -D "$LOCAL_TAG" >/dev/null 2>&1

            if [ -n "$VERBOSE" ];
            then
                echo "${DEBUG} git branch -D \"${LOCAL_TAG}\" >/dev/null 2>&1"
            fi

            say " - subtree split for '${TAG}'"
            git subtree split -q --annotate="${ANNOTATE}" --prefix="$SUBPATH" --branch="$LOCAL_TAG" "$TAG" >/dev/null 2>&1
            RETURNCODE=$?

            if [ -n "$VERBOSE" ];
            then
                echo "${DEBUG} git subtree split -q --annotate=\"${ANNOTATE}\" --prefix=\"$SUBPATH\" --branch=\"$LOCAL_TAG\" \"$TAG\" >/dev/null"
            fi

            say " - subtree split for '${TAG}' [DONE]"
            if [ $RETURNCODE -eq 0 ]
            then
                PUSH_CMD="git push -q ${DRY_RUN} --force ${REMOTE_NAME} ${LOCAL_TAG}:refs/tags/${TAG}"

                if [ -n "$VERBOSE" ];
                then
                    echo "${DEBUG} PUSH_CMD=\"${PUSH_CMD}\""
                fi

                if [ -n "$DRY_RUN" ]
                then
                    echo \# $PUSH_CMD
                    $PUSH_CMD
                else
                    $PUSH_CMD
                fi

                PUSHRETURNCODE=$?
                if [ $PUSHRETURNCODE -eq 0 ]
                then
                    say " - completed"
                fi
            fi
        done
    done

    popd >/dev/null
}

subsplit_update()
{
    subsplit_require_work_dir

    say "Updating subsplit from origin"

    git fetch -q -t origin
    git checkout master
    git reset --hard origin/master

    if [ -n "$VERBOSE" ];
    then
        echo "${DEBUG} git fetch -q -t origin"
        echo "${DEBUG} git checkout master"
        echo "${DEBUG} git reset --hard origin/master"
    fi

    popd >/dev/null
}

subsplit_main "$@"
