/*!
 * froala_editor v2.9.3 (https://www.froala.com/wysiwyg-editor)
 * License https://froala.com/wysiwyg-editor/terms/
 * Copyright 2014-2019 Froala Labs
 */

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = function( root, jQuery ) {
            if ( jQuery === undefined ) {
                // require('jQuery') returns a factory that requires window to
                // build a jQuery instance, we normalize how we use modules
                // that require this pattern but the window provided is a noop
                // if it's defined (how jquery works)
                if ( typeof window !== 'undefined' ) {
                    jQuery = require('jquery');
                }
                else {
                    jQuery = require('jquery')(root);
                }
            }
            return factory(jQuery);
        };
    } else {
        // Browser globals
        factory(window.jQuery);
    }
}(function ($) {
/**
 * Arabic
 */

$.FE.LANGUAGE['el'] = {
  translation: {
// Place holder
    "Type something": "Εισάγετε κείμενο",

    // Basic formatting
    "Bold": "Έντονα",
    "Italic": "Πλάγια",
    "Underline": "Υπογραμμισμένα",
    "Strikethrough": "Διαγραμμένα",

    // Main buttons
    "Insert": "Εισαγωγή",
    "Delete": "Διαγραφή",
    "Cancel": "Ακύρωση",
    "OK": "OK",
    "Back": "Πίσω",
    "Remove": "Αφαίρεση",
    "More": "Περισσότερα",
    "Update": "Ενημέρωση",
    "Style": "Εξατομίκευση",

    // Font
    "Font Family": "Γραμματοσειρά",
    "Font Size": "Μέγεθος",

    // Colors
    "Colors": "Χρώματα",
    "Background": "Φόντο",
    "Text": "Κείμενο",
    "HEX Color": "Χρώμα HEX",

    // Paragraphs
    "Paragraph Format": "Μορφή παραγράφου",
    "Normal": "Κανονική",
    "Code": "Κώδικας",
    "Heading 1": "Επικεφαλίδα 1",
    "Heading 2": "Επικεφαλίδα 2",
    "Heading 3": "Επικεφαλίδα 3",
    "Heading 4": "Επικεφαλίδα 4",

    // Style
    "Paragraph Style": "Εξατομίκευση παραγράφου",
  	"Gray": "Γκρι",
  	"Spaced": "Αραιά",
  	"Uppercase": "Κεφαλαία",
    "Inline Style": "Ενσωματωμένος τύπος",

    // Alignment
    "Align": "Ευθυγράμμιση",
    "Align Left": "Αριστερά",
    "Align Center": "Κέντρο",
    "Align Right": "Δεξιά",
    "Align Justify": "Γέμισμα",
    "None": "Χωρίς ευθυγράμμιση",

    // Lists
    "Ordered List": "Διεταγμένη λίστα",
    "Default": "Προκαθορισμένο",
    "Lower Alpha": "Χαμηλότερο άλφα",
    "Lower Greek": "Κάτω ελληνικά",
    "Lower Roman": "Χαμηλότερο ρωμαϊκό",
    "Upper Alpha": "Ανώτερο άλφα",
    "Upper Roman": "Ανώτερο ρωμαϊκό",

    "Unordered List": "Αναδιάταχτη λίστα",
    "Circle": "Κύκλος",
    "Disc": "Δίσκος",
    "Square": "Τετράγωνο",

    // Line height
    "Line Height": "Ύψος γραμμής",
    "Single": "Μονόκλινο",
    "Double": "Διπλό",

    // Indent
    "Decrease Indent": "Μείωση πλαισίου",
    "Increase Indent": "Αύξηση πλαισίου",

    // Links
    "Insert Link": "Εισαγωγή συνδέσμου",
    "Open in new tab": "Άνοιγμα σε νέα καρτέλα",
    "Open Link": "Άνοιγμα συνδέσμου",
    "Edit Link": "Επεξεργασία συνδέσμου",
    "Unlink": "Αποσύνδεση",
    "Choose Link": "Επιλογή συνδέσμου",

    // Images
    "Insert Image": "Εισαγωγή εικόνας",
    "Upload Image": "Ανέβασμα εικόνας",
    "By URL": "Από URL",
    "Browse": "Περιήγηση",
    "Drop image": "Σύρετε εικόνα",
    "or click": "ή κάντε κλικ",
    "Manage Images": "Διαχείριση εικόνων",
    "Loading": "Φόρτωση",
    "Deleting": "Διαγραφή",
    "Tags": "Ετικέτες",
    "Are you sure? Image will be deleted.": "Σίγουρα; Η εικόνα θα διαγραφεί.",
    "Replace": "Αντικατάσταση",
    "Uploading": "Ανέβασμα",
    "Loading image": "Φόρτωση εικόνας",
    "Display": "Προβολή",
    "Inline": "Ενσωματωμένη",
    "Break Text": "Σπάσιμο κειμένου",
    "Alternative Text": "Εναλλακτικό κείμενο",
    "Change Size": "Αλλαγή μεγέθους",
    "Width": "Πλάτος",
    "Height": "Ύψος",
    "Something went wrong. Please try again.": "Κάτι πήγε στραβά. Προσπαθήστε ξανά.",
    "Image Caption": "Λεζάντα εικόνας",
    "Advanced Edit": "Προχωρημένη επεξεργασία",
	"Rounded": "Κυκλικός",
	"Bordered": "Πλαίσιο",
	"Shadow": "Σκια",

    // Video
    "Insert Video": "Εισαγωγή βίντεο",
    "Embedded Code": "Ενσωμάτωση κώδικα",
    "Paste in a video URL": "Εισαγωγή URL βίντεο",
    "Drop video": "Σύρετε βίντεο",
    "Your browser does not support HTML5 video.": "Ο περιηγητής σας δεν υποστηρίζει βίντεο τύπου HTML5.",
    "Upload Video": "Ανέβασμα βίντεο",

    // Tables
    "Insert Table": "Εισαγωγή πίνακα",
    "Table Header": "Επικεφαλίδα πίνακα",
    "Remove Table": "Αφαίρεση πίνακα",
    "Table Style": "Εξατομίκευση πίνακα",
    "Horizontal Align": "Οριζόντια ευθυγράμμιση",
    "Row": "Σειρά",
    "Insert row above": "Εισαγωγή σειράς από πάνω",
    "Insert row below": "Εισαγωγή σειράς από κάτω",
    "Delete row": "Διαγραφή σειράς",
    "Column": "Στήλη",
    "Insert column before": "Εισαγωγή στήλης πριν",
    "Insert column after": "Εισαγωγή στήλης μετά",
    "Delete column": "Διαγραφή στήλης",
    "Cell": "Κελί",
    "Merge cells": "Συγχώνευση κελιών",
    "Horizontal split": "Οριζόντος διαχωρισμός",
    "Vertical split": "Κατακόρυφος διαχωρισμός",
    "Cell Background": "Φόντο κελιού",
    "Vertical Align": "Κατακόρυφη ευθυγράμμιση",
    "Top": "Κορυφή",
    "Middle": "Μέση",
    "Bottom": "Βάθος",
    "Align Top": "Ευθυγράμμιση κορυφής",
    "Align Middle": "Ευθυγράμμιση μέσης",
    "Align Bottom": "Ευθυγράμμιση βάθους",
    "Cell Style": "Εξατομίκευση κελιού",

    // Files
    "Upload File": "Ανέβασμα αρχείου",
    "Drop file": "Σύρετε αρχείο",

    // Emoticons
    "Emoticons": "Emoticons",
    "Grinning face": "Γέλιο",
    "Grinning face with smiling eyes": "Γέλιο με γελαστά μάτια",
    "Face with tears of joy": "Δάκρυα γέλιου (LOL)",
    "Smiling face with open mouth": "Χαμόγελο με ανοιχτό στόμα",
    "Smiling face with open mouth and smiling eyes": "Χαμόγελο με ανοιχτό στόμα και γελαστά μάτια",
    "Smiling face with open mouth and cold sweat": "Χαμόγελο με ανοιχτό στόμα και σταγόνα ιδρώτα",
    "Smiling face with open mouth and tightly-closed eyes": "Χαμόγελο με ανοιχτό στόμα και σφιχτά κλεισμένα μάτια",
    "Smiling face with halo": "Χαμόγελο με φωτοστέφανο",
    "Smiling face with horns": "Χαμογελαστό διαβολάκι",
    "Winking face": "Κλείσιμο ματιού",
    "Smiling face with smiling eyes": "Χαμόγελο με γελαστά μάτια",
    "Face savoring delicious food": "Νόστιμο",
    "Relieved face": "Ανακούφιση",
    "Smiling face with heart-shaped eyes": "Χαμόγελο με μάτια σε σχήμα καρδιάς",
    "Smiling face with sunglasses": "Χαμόγελο με γυαλιά ηλίου",
    "Smirking face": "Ειρωνία",
    "Neutral face": "Ουδέτερο",
    "Expressionless face": "Ανέκφραστο",
    "Unamused face": "Αψυχαγώγητο",
    "Face with cold sweat": "Σταγόνα ιδρώτα",
    "Pensive face": "Σκεπτικό",
    "Confused face": "Σύγχιση",
    "Confounded face": "Ακράτεια",
    "Kissing face": "Φιλί",
    "Face throwing a kiss": "Πάσα φιλιού",
    "Kissing face with smiling eyes": "Φιλί με γελαστά μάτια",
    "Kissing face with closed eyes": "Φιλί με κλειστά μάτια",
    "Face with stuck out tongue": "Γλώσσα",
    "Face with stuck out tongue and winking eye": "Γλώσσα με κλείσιμο ματιού",
    "Face with stuck out tongue and tightly-closed eyes": "Γλώσσα με σφιχτά κλεισμένα μάτια",
    "Disappointed face": "Απογοήτευση",
    "Worried face": "Ανυσηχία",
    "Angry face": "Θυμός",
    "Pouting face": "Έξαλλο",
    "Crying face": "Κλάμα θυμού",
    "Persevering face": "Έτοιμο να εκραγεί",
    "Face with look of triumph": "Θρίαμβος",
    "Disappointed but relieved face": "Απογοήτευση με ανακούφιση",
    "Frowning face with open mouth": "Απορία",
    "Anguished face": "Αγωνία",
    "Fearful face": "Φόβος",
    "Weary face": "Κούραση",
    "Sleepy face": "Εξάντληση",
    "Tired face": "Γκρίνια",
    "Grimacing face": "Γκριμάτσα",
    "Loudly crying face": "Δυνατό κλάμα",
    "Face with open mouth": "Έκπληξη",
    "Hushed face": "Σιωπή",
    "Face with open mouth and cold sweat": "Έκπληξη με ιδρώτα",
    "Face screaming in fear": "Πανικός",
    "Astonished face": "Ηλίθιο",
    "Flushed face": "Ντροπαλό",
    "Sleeping face": "Ύπνος",
    "Dizzy face": "Ζαλάδα",
    "Face without mouth": "Άφωνο",
    "Face with medical mask": "Νοσηλευτική μάσκα",

    // Line breaker
    "Break": "Σπάσιμο",

    // Math
    "Subscript": "Υποκείμενο",
    "Superscript": "Υπερκείμενο",

    // Full screen
    "Fullscreen": "Πλήρης οθόνη",

    // Horizontal line
    "Insert Horizontal Line": "Εισαγωγή οριζόντιας γραμμής",

    // Clear formatting
    "Clear Formatting": "Εκαθάριση μορφοποίησης",

    // Save
    "Save": "Αποθηκεύσετε",

    // Undo, redo
    "Undo": "Αναίρεση",
    "Redo": "Επανάληψη",

    // Select all
    "Select All": "Επιλογή Όλων",

    // Code view
    "Code View": "Προβολή Κώδικα",

    // Quote
    "Quote": "Απόσπασμα",
    "Increase": "Αύξηση",
    "Decrease": "Μείωση",

    // Quick Insert
    "Quick Insert": "Γρήγορη εισαγωγή",

    // Spcial Characters
    "Special Characters": "Ειδικοί χαρακτήρες",
    "Latin": "Λατινικοί",
    "Greek": "Ελληνικοί",
    "Cyrillic": "Κρυλλικοί",
    "Punctuation": "Σημεία στήξης",
    "Currency": "Συνάλλαγμα",
    "Arrows": "Βέλη",
    "Math": "Μαθηματικά",
    "Misc": "Διάφοροι",

    // Print.
    "Print": "Εκτύπωση",

    // Spell Checker.
    "Spell Checker": "Έλεγχος ορθογραφίας",

    // Help
    "Help": "Βοήθεια",
    "Shortcuts": "Συντομεύσεις",
    "Inline Editor": "Ενσωματωμένος επεξεργαστής",
    "Show the editor": "Εμφάνιση επεξεργαστή",
    "Common actions": "Κοινές ενέργειες",
    "Copy": "Αντιγραφή",
    "Cut": "Αποκοπή",
    "Paste": "Επικόλληση",
    "Basic Formatting": "Βασική διαμόρφωση",
    "Increase quote level": "Αύξηση επιπέδου αποσπάσματος",
    "Decrease quote level": "Μείωση επιπέδου αποσπάσματος",
    "Image / Video": "Εικόνα / Βίντεο",
    "Resize larger": "Αύξηση μεγέθους",
    "Resize smaller": "Μείωση μεγέθους",
    "Table": "Πίνακας",
    "Select table cell": "Επιλογή κελιού από πίνακα",
    "Extend selection one cell": "Επέκταση επιλογής κατά ένα κελί",
    "Extend selection one row": "Επέκταση επιλογής κατά μια σειρά",
    "Navigation": "Πλοήγηση",
    "Focus popup / toolbar": "Εστίαση αναδυόμενου / εργαλειοθήκης",
    "Return focus to previous position": "Επιστροφή εστίασης στην προηγούμενη θέση",

    // Embed.ly
    "Embed URL": "Ενσωμάτωση URL",
    "Paste in a URL to embed": "Εισάγετε ένα URL για ενσωμάτωση",

    // Word Paste.
    "The pasted content is coming from a Microsoft Word document. Do you want to keep the format or clean it up?": "Το περιεχόμενο που επικολλήσατε προέρχεται από ένα έγγραφο του Microsoft Word. Θέλετε να διατηρήσετε το έγγραφο ή να το καταργήσετε;",
    "Keep": "Διατήρηση",
    "Clean": "Κατάργηση",
    "Word Paste Detected": "Εντοπίστηκε επικόλληση από αρχείο Word"
  },
  direction: "ltr"
};

}));
