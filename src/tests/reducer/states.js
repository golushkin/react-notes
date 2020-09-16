export function get_empty_state() {
    return {
        currentMenu: '',
        notes: []
    }
}

export function get_state_for_shallow() {
    return {
        currentMenu: '',
        notes: [
            {
                title: 'test0',
                desc: '',
                children: [],
                links: []
            }
        ]
    }
}


export function get_state_for_deep() {
    return {
        currentMenu: '',
        notes: [
            {
                title: 'test0',
                desc: '',
                children: [
                    {
                        title: 'test1',
                        desc: '',
                        children: [],
                        links: []
                    }
                ],
                links: []
            }
        ]
    }
}

export function get_state_for_shallow_link() {
    return {
        currentMenu: '',
        notes: [
            {
                title: 'test0',
                desc: '',
                children: [],
                links: [
                    {
                        desc: '',
                        link: 'https://test-link.com'
                    }
                ]
            }
        ]
    }
}


export function get_state_for_deep_link() {
    return {
        currentMenu: '',
        notes: [
            {
                title: 'test0',
                desc: '',
                children: [
                    {
                        title: 'test1',
                        desc: '',
                        children: [],
                        links: [{
                            desc: '',
                            link: 'https://test-link.com'
                        }]
                    }
                ],
                links: []
            }
        ]
    }
}