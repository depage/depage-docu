I18N = ~/Dev/depage-cms/www/framework/i18n.sh
JSMIN = ~/Dev/depage-cms/www/framework/JsMin/minimize

PROJECTNAME=projectName

SASSDIR = src/scss/
CSSDIR = www/
JSDIR = src/js/
DOXYAWESOME_DIR = doxygen-awesome-css/

.PHONY: all min minjs locale locale-php sass sassc push pushdev pushlive

doc: min
	( cat DoxyfileDocu ; echo "PROJECT_NUMBER=$(VERSION)" ) | doxygen -
	cp -r www/lib Docs/html/

all: min

min: sass

$(JSDIR)global.min.js: \
    $(JSDIR)jquery-1.12.3.min.js \
    $(JSDIR)dynsections.js \
    $(JSDIR)global.js
	$(JSMIN) --dp-path . --target=$@ $^

locale:
	cd www/lib/ ; $(I18N)

$(DOXYAWESOME_DIR)doxygen-awesome.css: 
	git submodule update --init --recursive

sass: \
    $(SASSDIR)*.scss \
    $(DOXYAWESOME_DIR)doxygen-awesome.css \
    $(DOXYAWESOME_DIR)doxygen-awesome-sidebar-only.css \
    $(DOXYAWESOME_DIR)doxygen-awesome-sidebar-only-darkmode-toggle.css
	sass --update $(SASSDIR):$(CSSDIR) --style=compressed --no-source-map

clean:
	rm -r Docs/html/
