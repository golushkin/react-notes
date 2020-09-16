import React from 'react'
import {
    render, screen,
    cleanup, waitFor
} from '@testing-library/react'
import { Simulate } from 'react-dom/test-utils'
import { Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createMemoryHistory } from 'history'
import userEvent from '@testing-library/user-event'
import { store } from '../../store/index'
import { Sidebar } from '../../components/NoteDisplay/Sidebar'
import { initialState } from '../../store/reducers/data/initialState'
import { change_current_note } from '../../store/actions/data'
import { routes } from '../../routes'

store.dispatch = jest.fn()

let props_obj = {
    notes: initialState.notes,
    currentMenu: initialState.currentMenu,
    change_current_note: (route) => store.dispatch(change_current_note(route))
}

afterEach(()=>{
    props_obj = {
        notes: initialState.notes,
        currentMenu: initialState.currentMenu,
        change_current_note: (route) => store.dispatch(change_current_note(route))
    }
    cleanup()
})

test('create new note ', () => {
    const history = createMemoryHistory()
    render(
        <Provider store={store}>
            <Router history={history}>
                <Sidebar {...props_obj} />
            </Router>
        </Provider>);

    userEvent.click(screen.getByText(/Create Note/i))
    expect(history.location.pathname).toBe(routes.create);
})

test('go to new route ', () => {
    const history = createMemoryHistory()
    render(
        <Provider store={store}>
            <Router history={history}>
                <Sidebar {...props_obj} />
            </Router>
        </Provider>);
    userEvent.click(screen.getByTestId('0-0'))
    waitFor(()=>{
        expect(screen.getByText(/speaking/i)).toBeInTheDocument()
        expect(store.getState().currentMenu).toBe('0-0')
    }).catch(err => {throw err})
    
})


test('render tree without elements ', () => {
    const history = createMemoryHistory()
    props_obj.notes = []
    render(
        <Provider store={store}>
            <Router history={history}>
                <Sidebar {...props_obj} />
            </Router>
        </Provider>);

    expect(screen.getByTestId('tree').children.length).toBe(0);
})

test('render tree with elements ', () => {
    const history = createMemoryHistory()
    render(
        <Provider store={store}>
            <Router history={history}>
                <Sidebar {...props_obj} />
            </Router>
        </Provider>);

    expect(screen.getByTestId('tree').children.length).toBeGreaterThan(0);
})
