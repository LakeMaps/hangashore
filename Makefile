.PHONY: all get-deps

all:
	cd src/Hangashore/ &&\
	npm run build

get-deps:
	cd src/Hangashore/ &&\
	npm install &&\
	curl -sSL https://git.io/v1knr | patch -p1
