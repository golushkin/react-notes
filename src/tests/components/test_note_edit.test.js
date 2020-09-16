import React from 'react'
import {
    render, screen, act,
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
import NoteDisplay from '../../components/NoteDisplay/index'
import NoteEdit from '../../components/NoteEdit/index'
import { routes } from '../../routes'
import { ExpansionPanelActions } from '@material-ui/core'

let store, history

beforeEach(() => {
    cleanup()
    store = createStore(data)
    history = createMemoryHistory()
    history.push(`${routes.edit}/0`)
})


test('render note edit component', () => {
    render(
        <Provider store={store}>
            <Router history={history}>
                <Route path={`${routes.edit}/:route`} component={NoteEdit} />
            </Router>
        </Provider>
    )
    expect(screen.getByTestId('note-edit')).toBeInTheDocument()
    expect(screen.getByTestId('btn-update')).toBeEnabled()
})

test('cancel edit', () => {
    history.replace(routes.home)
    history.push(`${routes.edit}/0`)
    render(
        <Provider store={store}>
            <Router history={history}>
                <Route path={routes.home} exact component={NoteDisplay} />
                <Route path={`${routes.edit}/:route`} component={NoteEdit} />
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
                <Route path={`${routes.edit}/:route`} component={NoteEdit} />
            </Router>
        </Provider>
    )
    const title = screen.getByTestId('edit-title')
    const btn = screen.getByTestId('btn-update')

    userEvent.type(title, 'test')
    expect(btn).toBeEnabled()

    fireEvent.change(title, { target: { value: '' } })
    expect(btn).toBeDisabled()
})

test('edit required link', () => {
    render(
        <Provider store={store}>
            <Router history={history}>
                <Route path={`${routes.edit}/:route`} component={NoteEdit} />
            </Router>
        </Provider>
    )
    const link = screen.getByTestId('edit-link-0')
    const btn = screen.getByTestId('btn-update')

    userEvent.type(link, 'https://localhost.com/')
    expect(btn).toBeEnabled()

    fireEvent.change(link, { target: { value: '' } })
    expect(btn).toBeDisabled()
})



test('add link', () => {
    render(
        <Provider store={store}>
            <Router history={history}>
                <Route path={`${routes.edit}/:route`} component={NoteEdit} />
            </Router>
        </Provider>
    )
    const links = screen.getByTestId('edit-links')
    const create_link = screen.getByTestId('btn-create-link')
    const btn = screen.getByTestId('btn-update')

    userEvent.click(create_link)
    expect(links.children.length).toBe(initialState.notes[0].links.length + 1)
    expect(btn).toBeDisabled()
})

test('delete note: disagree', () => {
    render(
        <Provider store={store}>
            <Router history={history}>
                <Route path={`${routes.edit}/:route`} component={NoteEdit} />
            </Router>
        </Provider>
    )
    const btn_dialog = screen.getByTestId('btn-delete')

    expect(screen.queryByTestId('edit-dialog')).toBeNull()
    userEvent.click(btn_dialog)
    expect(screen.getByTestId('edit-dialog')).toBeInTheDocument()
    const btn_dialog_dis = screen.getByTestId('btn-dialog-dis')

    userEvent.click(btn_dialog_dis)
    waitFor(() => {
        expect(screen.queryByTestId('edit-dialog')).toBeNull()
    }).catch(error => {throw error})
})

test('delete note: agree', () => {
    render(
        <Provider store={store}>
            <Router history={history}>
                <Route path={`${routes.edit}/:route`} component={NoteEdit} />
            </Router>
        </Provider>
    )
    const btn_dialog = screen.getByTestId('btn-delete')

    expect(screen.queryByTestId('edit-dialog')).toBeNull()
    userEvent.click(btn_dialog)
    expect(screen.getByTestId('edit-dialog')).toBeInTheDocument()
    const btn_dialog_ag = screen.getByTestId('btn-dialog-ag')

    userEvent.click(btn_dialog_ag)
    waitFor(() => {
        expect(screen.getByText(/You don't have any notes/i)).toBeInTheDocument()
        expect(history.location.pathname).toBe(routes.home)
    }).catch(error => {throw error})
})

test('update note: title', () => {
    render(
        <Provider store={store}>
            <Router history={history}>
                <Route path={`${routes.edit}/:route`} component={NoteEdit} />
            </Router>
        </Provider>
    )
    const btn_update = screen.getByTestId('btn-update')
    const edit_title = screen.getByTestId('edit-title')

    userEvent.type(edit_title, 'Test')
    userEvent.click(btn_update)
    waitFor(() => {
        expect(screen.getByText(/Test/i)).toBeInTheDocument()
        expect(history.location.pathname).toBe(routes.home)
    }).catch(error => {throw error})
})

test('update note: title, link', () => {
    render(
        <Provider store={store}>
            <Router history={history}>
                <Route path={`${routes.edit}/:route`} component={NoteEdit} />
            </Router>
        </Provider>
    )
    const btn_update = screen.getByTestId('btn-update')
    const edit_title = screen.getByTestId('edit-title')
    const edit_link = screen.getByTestId('edit-link-0')

    userEvent.type(edit_title, 'Test')
    userEvent.type(edit_link, 'https://test-link.com/')

    userEvent.click(btn_update)
    waitFor(() => {
        expect(screen.getByText(/Test/i)).toBeInTheDocument()
        expect(screen.getByText(/https:\/\/test-link.com\//i)).toBeInTheDocument()
        expect(history.location.pathname).toBe(routes.home)
    }).catch(error => {throw error})
})

test('update note: title, link and new link', () => {
    render(
        <Provider store={store}>
            <Router history={history}>
                <Route path={`${routes.edit}/:route`} component={NoteEdit} />
            </Router>
        </Provider>
    )
    const btn_update = screen.getByTestId('btn-update')
    const btn_create_link = screen.getByTestId('btn-create-link')
    const edit_title = screen.getByTestId('edit-title')
    const edit_link = screen.getByTestId('edit-link-0')

    userEvent.type(edit_title, 'Test')
    userEvent.type(edit_link, 'https://test-link.com/')

    userEvent.click(btn_create_link)
    const edit_link1 = screen.getByTestId('edit-link-2')
    userEvent.type(edit_link1, 'https://test-link1.com/')

    userEvent.click(btn_update)
    waitFor(() => {
        expect(screen.getByText(/Test/i)).toBeInTheDocument()
        expect(screen.getByText(/https:\/\/test-link.com\//i)).toBeInTheDocument()
        expect(screen.getByText(/https:\/\/test-link1.com\//i)).toBeInTheDocument()
        expect(history.location.pathname).toBe(routes.home)
    }).catch(error => {throw error})
})