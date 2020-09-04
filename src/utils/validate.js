export function validate(value, validationRules){
    let valid = {
        isValid: true,
        msg: []
    }

    for(let rule in validationRules){
        switch (rule) {
            case 'isRequired':
                isRequired(value, valid)
                break;

            case 'maxLen':
                maxLen(value, validationRules[rule], valid)
                break;

            case 'matchPattern':
                matchPattern(value, validationRules[rule], valid)
                break
        
            default:
                valid.isValid = valid.isValid
                break;
        }
    }

    return valid
}

function isRequired(value, valid){
    if (value.trim() === '') {
        valid.isValid = false
        valid.msg.push('Empty Field')
    }
}

function maxLen(value, valid_value, valid){
    if (value.length > valid_value) {
        valid.isValid = false
        valid.msg.push('Field length is more than 50 characters')
    }
}

function matchPattern(value, pattern, valid){
    if (!pattern.test(value)) {
        valid.isValid = false
        valid.msg.push('This value isn\'t a link')
    }
}