.PHONY: all get-deps

all:
	cd src/Hangashore/ &&\
	npm run build

get-deps:
	cd src/Hangashore/ &&\
	npm install &&\
	rm node_modules/serialport/build/Release/serialport.node &&\
	node_modules/.bin/electron-rebuild &&\
	curl -sSL https://git.io/v1knr | patch -p1
