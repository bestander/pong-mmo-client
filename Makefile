
build: src/pongGame.js
	@component build
	@uglifyjs ./build/build.js -o ./build/build-min.js -c -m

build-dev: src/pongGame.js
	@component build --dev -n build-dev

components: component.json
	@component install --dev

clean:
	rm -rf build components

.PHONY: clean



