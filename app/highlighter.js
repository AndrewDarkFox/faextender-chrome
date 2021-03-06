/* Journal highlight */

const StorageLoader = require("./loaderclasses").StorageLoader;
const settings_keys = require("./common").settings_keys;


class Highlighter extends StorageLoader {
    /*
        highlighter_keys should have the following structure:
        [{
            "type": "journal|submission"
            "field": "title|username",
            "text": "matchtext",
            "color": "matchcolor"
        }]
    */

    constructor() {
        super(settings_keys.highlighter.keys);
        this.args = {};
    }

    init() {
        // Exit if no keys are set
        let keys = this.options[settings_keys.highlighter.keys];
        if (!keys) return;
        keys = keys.filter((f) => f.type === this.args.name);
        if (!keys) return;

        // Iterate through each row
        jQuery(this.args.match).each((i, row) => {
            // Evaluate each test
            jQuery.each(this.args.tests, (field, match) => {
                // Perform the test
                return this.evaluateRow(row, keys, field, match);
            });
        });
    }

    evaluateRow(row, list, type, match) {
        // Get match target text
        const target = jQuery(match, row).text().toLowerCase();

        // Iterate through each list element
        for (let i = 0; i < list.length; i++) {
            const item = list[i];

            // Test for match
            if (target.indexOf(item.text.toLowerCase()) > -1) {
                // Set background color
                jQuery(row).css("background-color", item.color);
                return false;
            }
        }

        // No matches
        return true;
    }
}

class JournalHighlighter extends Highlighter {
    constructor() {
        super();
        this.args = {
            "name": "journal",
            "match": "#messages-journals ul.message-stream li",
            "tests": {
                "user": "a[href^='/user/']",
                "title": "a[href^='/journal/']"
            }
        };
    }
}

class SubmissionHighlighter extends Highlighter {
    constructor() {
        super();
        this.args = {
            "name": "submission",
            "match": "#messages-form .messagecenter b",
            "tests": {
                "user": "a[href^='/user/']",
                "title": "span"
            }
        };
    }
}


module.exports = (base) => {
    base.registerTarget(() => new JournalHighlighter(), "/msg/others/");
    base.registerTarget(() => new SubmissionHighlighter(), "/msg/submissions/");
};
