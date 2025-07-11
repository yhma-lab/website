SHELL := /bin/bash

serve:
	hugo server --bind "0.0.0.0" --printPathWarnings --printI18nWarnings

get-mod:
	hugo mod get -u

clean-mod:
	hugo mod clean --all

clean:
	rm -rf ./public

build: clean
	hugo --cleanDestinationDir --gc --minify

setup: clean-mod get-mod


deploy:
	pnpm run publish
