SHELL := /bin/bash

serve:
	hugo server --bind "0.0.0.0" -D --printPathWarnings --printUnusedTemplates

get-mod:
	hugo mod get -u

clean-mod:
	hugo mod clean --all

clean:
	rm -rf ./public

build: clean
	hugo --cleanDestinationDir --gc --minify

setup: clean-mod get-mod
