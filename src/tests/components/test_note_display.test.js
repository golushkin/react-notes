import React from 'react'
import {
    render, screen,
    cleanup, waitFor
} from '@testing-library/react'
import { Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createMemoryHistory } from 'history'
import userEvent from '@testing-library/user-event'
import { createStore } from 'redux'
import { data } from '../../store/reducers/data/index'
import { delete_note, change_current_note } from '../../store/actions/data'
import NoteDisplay from '../../components/NoteDisplay/index'
import NoteEdit from '../../components/NoteEdit/index'
import { routes } from '../../routes'

let store, history

beforeEach(()=>{
    cleanup()
    store = createStore(data)
    history = createMemoryHistory()
    history.push(routes.home)
})


test('render display component without notes', () => {
    store.dispatch(delete_note('0'))
    render(
        <Provider store={store}>
            <Router history={history}>
                <NoteDisplay/>
            </Router>
        </Provider>); 

    expect(screen.getByText(/You don't have any notes/i)).toBeInTheDocument()
})

test('render display component without selected note', () => {
    store.dispatch(change_current_note(''))
    
    render(
        <Provider store={store}>
            <Router history={history}>
                <NoteDisplay/>
            </Router>
        </Provider>);  

    expect(screen.getByText(/Choose note that you want to see/i)).toBeInTheDocument()
})

test('render display with note', () => {
    render(
        <Provider store={store}>
            <Router history={history}>
                <NoteDisplay/>
            </Router>
        </Provider>);  

    expect(screen.getByTestId('note')).toBeInTheDocument()
})


test('go to edit note', () => {
    render(
        <Provider store={store}>
            <Router history={history}>
                <Route component={NoteDisplay} exact path={`${routes.home}`}/>
                <Route component={NoteEdit} path={`${routes.edit}/:route`}/>
            </Router>
        </Provider>);  
    userEvent.click(screen.getByTestId('edit-btn'))
    waitFor(()=>{
        expect(screen.getByTestId('note-edit')).toBeInTheDocument()
        expect(history.location.pathname).toBe(`${routes.edit}/${0}`)
    }).catch(err => {throw err})
})