I18N = ~/Dev/depage-cms/www/framework/i18n.sh
JSMIN = ~/Dev/depage-cms/www/framework/JsMin/minimize

PROJECTNAME=projectName

SASSDIR = www/lib/global/sass/
CSSDIR = www/lib/global/css/
JSDIR = www/lib/global/js/

.PHONY: all min minjs locale locale-php sass sassc push pushdev pushlive

doc:
	( cat DoxyfileDocu ; echo "PROJECT_NUMBER=$(VERSION)" ) | doxygen -
	cp -r www/lib Docs/html/


all: sassc min

min: sassc $(JSDIR)global.min.js

$(JSDIR)global.min.js: \
    $(JSDIR)jquery-1.12.3.min.js \
    $(JSDIR)dynsections.js \
    $(JSDIR)global.js
	$(JSMIN) --dp-path . --target=$@ $^

locale:
	cd www/lib/ ; $(I18N)

$(CSSDIR)%.css: www/lib/global/sass/%.scss www/lib/global/sass/modules/*.scss
	sassc --style compressed $< $@

sassc: $(patsubst %.scss,$(CSSDIR)%.css, $(notdir $(wildcard $(SASSDIR)*.scss)))

sass:
	sass --update $(SASSDIR):$(CSSDIR) -r ./$(SASSDIR)mixins/helper/functions.rb --style compressed --sourcemap=none
