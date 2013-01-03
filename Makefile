
build: src
	@component build --dev -n build-dev

components: component.json
	@component install --dev

clean:
	rm -rf build components

.PHONY: clean



