/*
 * Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
 *  
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation 
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the 
 * Software is furnished to do so, subject to the following conditions:
 *  
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *  
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
 * DEALINGS IN THE SOFTWARE.
 * 
 */

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, $ */

define(function (require, exports, module) {
    "use strict";
    
    var AppInit                 = require("utils/AppInit"),
        Editor                  = require("editor/Editor").Editor,
        EditorManager           = require("editor/EditorManager"),
        Commands                = require("command/Commands"),
        CommandManager          = require("command/CommandManager"),
        PreferencesManager      = require("preferences/PreferencesManager"),
        Strings                 = require("strings");
    
    /**
     * @private
     * 
     * Maps from preference names to the parameters needed to update the checked status.
     */
    var _optionMapping = {
        showLineNumbers:    [Commands.TOGGLE_LINE_NUMBERS, "getShowLineNumbers"],
        styleActiveLine:    [Commands.TOGGLE_ACTIVE_LINE, "getShowActiveLine"],
        wordWrap:           [Commands.TOGGLE_WORD_WRAP, "getWordWrap"],
        closeBrackets:      [Commands.TOGGLE_CLOSE_BRACKETS, "getCloseBrackets"]
    };
    
    /**
     * @private
     * 
     * Updates the command checked status based on the preference name given.
     * 
     * @param {string} name Name of preference that has changed
     */
    function _updateCheckedState(name) {
        var mapping = _optionMapping[name];
        if (!mapping) {
            return;
        }
        CommandManager.get(mapping[0]).setChecked(Editor[mapping[1]]());
    }
    
    // Listen to preference changes for the preferences we care about
    Object.keys(_optionMapping).forEach(function (preference) {
        PreferencesManager.on("change", preference, function () {
            _updateCheckedState(preference);
        });
    });
        
    /**
     * @private
     * Activates/Deactivates showing line numbers option
     */
    function _toggleLineNumbers() {
        Editor.setShowLineNumbers(!Editor.getShowLineNumbers());
        _updateCheckedState("showLineNumbers");
    }
    

    /**
     * @private
     * Activates/Deactivates showing active line option
     */
    function _toggleActiveLine() {
        Editor.setShowActiveLine(!Editor.getShowActiveLine());
        _updateCheckedState("styleActiveLine");
    }
    

    /**
     * @private
     * Activates/Deactivates word wrap option
     */
    function _toggleWordWrap() {
        Editor.setWordWrap(!Editor.getWordWrap());
        _updateCheckedState("wordWrap");
    }
    
    /**
     * @private
     * Activates/Deactivates the automatic close brackets option
     */
    function _toggleCloseBrackets() {
        Editor.setCloseBrackets(!Editor.getCloseBrackets());
        _updateCheckedState("closeBrackets");
    }
    
    function _init() {
        CommandManager.get(Commands.TOGGLE_LINE_NUMBERS).setChecked(Editor.getShowLineNumbers());
        CommandManager.get(Commands.TOGGLE_ACTIVE_LINE).setChecked(Editor.getShowActiveLine());
        CommandManager.get(Commands.TOGGLE_WORD_WRAP).setChecked(Editor.getWordWrap());
        CommandManager.get(Commands.TOGGLE_CLOSE_BRACKETS).setChecked(Editor.getCloseBrackets());
    }
    
    CommandManager.register(Strings.CMD_TOGGLE_LINE_NUMBERS, Commands.TOGGLE_LINE_NUMBERS, _toggleLineNumbers);
    CommandManager.register(Strings.CMD_TOGGLE_ACTIVE_LINE, Commands.TOGGLE_ACTIVE_LINE, _toggleActiveLine);
    CommandManager.register(Strings.CMD_TOGGLE_WORD_WRAP, Commands.TOGGLE_WORD_WRAP, _toggleWordWrap);
    CommandManager.register(Strings.CMD_TOGGLE_CLOSE_BRACKETS, Commands.TOGGLE_CLOSE_BRACKETS, _toggleCloseBrackets);

    AppInit.htmlReady(_init);
});
