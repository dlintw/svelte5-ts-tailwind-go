# release by: make clean && make setup && make && make docker
NAME = svelte5-ts-tailwind-go
GO_OUTPUT = $(realpath .)/${NAME}
GO_SOURCE = $(sort $(wildcard *.go) main.go)
FRONTEND_BUILD_DIR = dist
FRONTEND_SOURCE := index.html $(wildcard public/*) $(shell find src -type f) \
				   vite.config.ts

ALLOWED_LICENSES_COMMA ?= "MIT,BSD-3-Clause,Apache-2.0,MPL-2.0,ISC"
# Note: BlueOak-1.0.0 is not a valid license for use
#   https://github.com/nodejs/node/issues/49625
ALLOWED_LICENSES_SEMICOLON ?= "MIT;BSD-3-Clause;Apache-2.0;ISC;OFL-1.1;CC0-1.0;0BSD;UNLICENSED;Python-2.0;CC-BY-4.0;CC-BY-3.0;BSD-2-Clause;BlueOak-1.0.0"
IGNORE ?= "example.com/"${NAME}

all: $(GO_OUTPUT)  ## build backend
	ls -lh $(GO_OUTPUT)
$(GO_OUTPUT): front.stamp $(sort $(GO_SOURCE))
	@echo "Building Go application..."
	go build -ldflags="-s -w" -o $(GO_OUTPUT)
	@echo "Go application build completed."

front.stamp: $(FRONTEND_SOURCE)
	@echo "Building svelte frontend..."
	bun run build
	-du -hs $(FRONTEND_BUILD_DIR)
	touch front.stamp
	@echo "svelte frontend build completed."

fmt:  ## format code
	bun run format && bun run lint && bun run check
	gofmt -w *.go

fixbase:  ## fix 'base' for gh-pages
	rm -f vite.config.js
	sed -i 's|base: "/"|base: "/svelte5-ts-tailwind-go"|' vite.config.ts

lint:  ## lint for frontend and backend code
	bun run lint && bun run check

clean:  ## clean
	@echo "Cleaning up..."
	rm -rf $(FRONTEND_BUILD_DIR) $(GO_OUTPUT) $(GENERATED_FILES)
	rm -f front.stamp
	@echo "Clean up completed."

clobber: clean  ## clean all ignored files too
	-git clean -xd

run: all  ## run
	@echo "Running the application..."
	${GO_OUTPUT}

ci: fmt # run format before check in
	git add -A
	git commit

setup:  ## setup go module and install dependencies
	bun install
	go install github.com/google/go-licenses@latest

test: all ## TODO

licensecheck:  ## check license
	go-licenses check ./... --allowed_licenses=$(ALLOWED_LICENSES_COMMA) \
		--ignore=$(IGNORE) --one_output
	bunx license-checker --onlyAllow=$(ALLOWED_LICENSES_SEMICOLON)

help h: ## print our all commands to commandline
	@grep -E '^[a-zA-Z _-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "} { printf "\033[32m%-16s\033[0m %s\n", $$1,$$2 }'

# Always build the specified target
.PHONY: all fmt lint clean clobber run ci setup test licensecheck help h
