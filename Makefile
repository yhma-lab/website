SHELL := /bin/bash

serve:
	hugo server --bind "0.0.0.0"

mod-gu:
	hugo mod get -u

clean:
	hugo mod clean --all

build:
	hugo

setup: clean mod-gu
