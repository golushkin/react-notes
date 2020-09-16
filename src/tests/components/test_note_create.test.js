import React from 'react'
import {
    render, screen,
    cleanup, fireEvent, waitFor
} from '@testing-library/react'
import { Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createMemoryHistory } from 'history'
import userEvent from '@testing-library/user-event'
import { createStore } from 'redux'
import { data } from '../../store/reducers/data/index'
import { delete_note, change_current_note } from '../../store/actions/data'
import { initialState } from '../../store/reducers/data/initialState'
import NoteCreate from '../../components/NoteCreate/index'
import { routes } from '../../routes'

let store, history

beforeEach(() => {
    cleanup()
    store = createStore(data)
    history = createMemoryHistory()
    history.push(routes.create)
})


test('render note create component', () => {
    render(
        <Provider store={store}>
            <Router history={history}>
                <Route path={routes.create} component={NoteCreate} />
            </Router>
        </Provider>
    )
    expect(screen.getByTestId('note-create')).toBeInTheDocument()
    expect(screen.getByTestId('btn-create')).toBeDisabled()
})

test('cancel edit', () => {
    history.replace(routes.home)
    history.push(routes.create)
    render(
        <Provider store={store}>
            <Router history={history}>
                <Route path={routes.create} component={NoteCreate} />
            </Router>
        </Provider>
    )
    const btn = screen.getByTestId('btn-cancel')
    userEvent.click(btn)
    expect(history.location.pathname).toBe(routes.home)
})

test('edit required title', () => {
    render(
        <Provider store={store}>
            <Router history={history}>
                <Route path={routes.create} component={NoteCreate} />
            </Router>
        </Provider>
    )
    const title = screen.getByTestId('edit-title')
    const btn = screen.getByTestId('btn-create')

    userEvent.type(title, 'test')
    expect(btn).toBeEnabled()

    fireEvent.change(title, { target: { value: '' } })
    expect(btn).toBeDisabled()
})

test('add link', () => {
    render(
        <Provider store={store}>
            <Router history={history}>
                <Route path={routes.create} component={NoteCreate} />
            </Router>
        </Provider>
    )

    const links = screen.getByTestId('edit-links')
    const create_link = screen.getByTestId('btn-create-link')
    const btn = screen.getByTestId('btn-create')

    userEvent.click(create_link)
    expect(links.children.length).toBe(1)
    expect(btn).toBeDisabled()
})

test('add link and data', () => {
    render(
        <Provider store={store}>
            <Router history={history}>
                <Route path={routes.create} component={NoteCreate} />
            </Router>
        </Provider>
    )

    const links = screen.getByTestId('edit-links')
    const create_link = screen.getByTestId('btn-create-link')
    const btn = screen.getByTestId('btn-create')

    userEvent.click(create_link)
    expect(links.children.length).toBe(1)
    userEvent.type(screen.getByTestId('edit-title', 'Test'))
    userEvent.type(screen.getByTestId('edit-link-0', 'https://test-link.com/'))
    waitFor(() => expect(btn).toBeEnabled())
        .catch(error => { throw error })
})


test('create note: title', () => {
    render(
        <Provider store={store}>
            <Router history={history}>
                <Route path={routes.create} component={NoteCreate} />
            </Router>
        </Provider>
    )
    const title = screen.getByTestId('edit-title')
    const btn = screen.getByTestId('btn-create')

    userEvent.type(title, 'Test')
    expect(btn).toBeEnabled()
    userEvent.click(btn)

    waitFor(() => {
        expect(store.getState().currentMenu).toBe('1')
        expect(screen.getByText(/Test/i)).toBeInTheDocument()
        expect(history.location.pathname).toBe(routes.home)
    }).catch(error => { throw error })
})

test('create note: title, link', () => {
    render(
        <Provider store={store}>
            <Router history={history}>
                <Route path={routes.create} component={NoteCreate} />
            </Router>
        </Provider>
    )
    const btn_create = screen.getByTestId('btn-create')
    const edit_title = screen.getByTestId('edit-title')
    const create_link = screen.getByTestId('btn-create-link')

    userEvent.click(create_link)
    const edit_link = screen.getByTestId('edit-link-0')

    userEvent.type(edit_title, 'Test')
    userEvent.type(edit_link, 'https://test-link.com/')

    userEvent.click(btn_create)
    waitFor(() => {
        expect(store.getState().currentMenu).toBe('1')
        expect(screen.getByText(/Test/i)).toBeInTheDocument()
        expect(screen.getByText(/https:\/\/test-link.com\//i)).toBeInTheDocument()
        expect(history.location.pathname).toBe(routes.home)
    }).catch(error => { throw error })
})


test('create deep note: title, link', () => {
    render(
        <Provider store={store}>
            <Router history={history}>
                <Route path={routes.create} component={NoteCreate} />
            </Router>
        </Provider>
    )
    global.document.createRange = () => ({
        setStart: () => { },
        setEnd: () => { },
        commonAncestorContainer: {
            nodeName: 'BODY',
            ownerDocument: document,
        },
    });
    const btn_create = screen.getByTestId('btn-create')
    const edit_title = screen.getByTestId('edit-title')
    const create_link = screen.getByTestId('btn-create-link')
    const autocomplete = screen.getByRole('button', { name: 'Open' })

    userEvent.click(autocomplete)
    const autocomplete_list = screen.getByTestId('auto-list')
    userEvent.click(autocomplete_list.children[0])

    userEvent.click(create_link)
    const edit_link = screen.getByTestId('edit-link-0')

    userEvent.type(edit_title, 'Test')
    userEvent.type(edit_link, 'https://test-link.com/')

    userEvent.click(btn_create)
    setTimeout(()=>{
        console.log(store.getState().currentMenu)
    }, 1000)
    
    waitFor(() => {
        // expect(store.getState().currentMenu).toBe('0-1')
        // expect(screen.getByText(/Test/i)).toBeInTheDocument()
        // expect(screen.getByText(/https:\/\/test-link.com\//i)).toBeInTheDocument()
        // expect(history.location.pathname).toBe(routes.home)
        expect(true).toBe(false)
    }).catch(error => { throw error })
})
