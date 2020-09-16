export function validate(value, validationRules) {
    let valid = {
        isValid: true,
        msg: []
    }

    for (let rule in validationRules) {
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
                break;
        }
    }

    return valid
}

export function validatePasswords(value1, value2, valid) {
    if (value1 !== value2) {
        valid.isValid = false
        valid.msg.push('This password don\'t equal to first password')
    }
    return valid
}

export function isFormValid(formControls,exclude=[], deep_check = false) {
    if (!deep_check) {
        return isFormValidShallow(formControls, exclude)
    }
    return isFormValidDeep(formControls, exclude)

}

function isFormValidShallow(formControls, exclude){
    let formValid = true
    for (let field in formControls) {
        if (!exclude.includes(field)) {
            formValid = formControls[field].valid.isValid && formValid
        }
    }
    return formValid
}


function isFormValidDeep(formControls, exclude){
    let formValid = true
    for (let field in formControls) {
        if(!exclude.includes(field)){
            if (Array.isArray(formControls[field])) {
                for(let array_item of formControls[field]){
                    formValid = isFormValidShallow(array_item, exclude) && formValid
                }
            }
            else{
                formValid = formControls[field].valid.isValid && formValid
            }
        }
    }
    return formValid
}



function isRequired(value, valid) {
    if (value.trim() === '') {
        valid.isValid = false
        valid.msg.push('Empty Field')
    }
}

function maxLen(value, valid_value, valid) {
    if (value.length > valid_value) {
        valid.isValid = false
        valid.msg.push(`Field length is more than ${valid_value} characters`)
    }
}

function matchPattern(value, pattern, valid) {
    if (!pattern.test(value)) {
        valid.isValid = false
        valid.msg.push('This value isn\'t a link')
    }
}

