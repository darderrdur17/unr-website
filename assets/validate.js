/* Client rules mirrored for the Apps Script enquiry endpoint. */
(function (global) {
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function enquiry(fields) {
    var errors = {};
    var name = String(fields.name || '').trim();
    var email = String(fields.email || '').trim();
    var message = String(fields.message || '').trim();
    var consent = fields.consent === true || fields.consent === 'yes' || fields.consent === 'on';

    if (name.length < 2 || name.length > 120) {
      errors.name = 'Name must be between 2 and 120 characters.';
    }
    if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
      errors.email = 'Enter a valid email address (max 254 characters).';
    }
    if (message.length < 10 || message.length > 2000) {
      errors.message = 'Message must be between 10 and 2000 characters.';
    }
    if (!consent) {
      errors.consent = 'Consent is required. No row is written without it.';
    }
    return errors;
  }

  global.UNR_VALIDATE = { enquiry: enquiry };
})(window);
