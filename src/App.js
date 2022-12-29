import React, { useReducer } from 'react';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';
import './App.css';

export const ACTIONS = {
    ADD_DIGIT: 'add-digit',
    CHOOSE_OPR: 'choose-operation',
    CLEAR: 'clear',
    DEL_DIGIT: 'delete-digit',
    EVAL: 'evaluate',
    PRE_RES: 'previous-evaluation'
}

var pre = ""
const history = {}

function reducer(state, {type, payload}) {
    switch (type) {
        case ACTIONS.ADD_DIGIT:
            if (state.overwrite) {
                return {
                    ...state,
                    currentInput: payload.digit,
                    overwrite: false
                }
            }
            if (payload.digit === "0" && state.currentInput === "0") return state
            if (payload.digit === "." && state.currentInput.includes(".")) {
                return state
            }
            return {
                ...state,
                currentInput: `${state.currentInput || ""}${payload.digit}`, 
            }
        case ACTIONS.CHOOSE_OPR:
            if (state.currentInput == null && state.previousInput == null) return state
            console.log("all is not null passed")
            if (state.currentInput === "0" && state.previousInput === "") return state
            console.log("pre is null passed")
            if (state.previousInput === "" || state.previousInput == null) {
                return {
                    ...state,
                    operation: payload.operation,
                    previousInput: state.currentInput,
                    currentInput: null
                }
            }

            if (state.currentInput === "" || state.currentInput == null) {
                return {
                    ...state,
                    operation: payload.operation
                }
            }

            return {
                ...state,
                previousInput: evaluate(state),
                operation: payload.operation,
                currentInput: null
            }
        case ACTIONS.DEL_DIGIT:
            if (state.overwrite) {
                return {
                    ...state,
                    currentInput: null,
                    overwrite: false
                }
            }
            if (state.currentInput == null) {
                return state
            }
            if (state.currentInput.length == 1) {
                return {
                    ...state,
                    currentInput: null
                }
            }

            return {
                ...state,
                currentInput: state.currentInput.slice(0, -1)
            }
        case ACTIONS.PRE_RES:
            return {
                ...state,
                currentInput: pre
            }
        case ACTIONS.CLEAR:
            return {
                ...state,
                overwrite: true,
                currentInput: "0",
                previousInput: null,
                operation: null
            }
        case ACTIONS.EVAL:
            if (state.currentInput == null ||
                state.previousInput == null ||
                state.operation == null) {
                return state
                }
            return {
                ...state,
                overwrite: true,
                currentInput: evaluate(state),
                operation: null,
                previousInput: null
            }
    }
}

function evaluate({ currentInput, previousInput, operation }) {
    const prev = parseFloat(previousInput)
    const current = parseFloat(currentInput)
    console.log(prev, current)
    if (isNaN(prev) || isNaN(current)) return ""
    let result = ""
        switch (operation) {
            case "+":
                result = prev + current
                break
            case "-":
                result = prev - current
                break
            case "*":
                result = prev * current
                break
            case "÷":
                result = prev / current
                break
            case "%":
                result = prev % current
                break
            case "^":
                result = prev ** current
                break
            // case " ":
            //     result = Math.sqrt(current) 
            //     break
        }
    pre = result.toString()
    return result.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
    maximumFractionDigits : 0,
})
function formatNum(num) {
    if (num == null) return
    const [integer, decimal] = num.split(".")
    if (decimal == null) return INTEGER_FORMATTER.format(integer)
    return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}


function App () {
    const [{ currentInput, previousInput, operation }, dispatch] = useReducer(reducer, {})

        return (
            <section>
                <div className='header-grid'>
                    <h1>Simple Calculator with React</h1>
                </div>
                <div className="calculator-grid">
                    <div className='output'>
                        <div className='previous-input'>{formatNum(previousInput)} {operation}</div>
                        <div className='current-input'>{formatNum(currentInput)}</div>
                    </div>
                    <button className='span-two' onClick={() => dispatch({type: ACTIONS.CLEAR})}>AC</button>
                    <button onClick={() => dispatch({ type: ACTIONS.DEL_DIGIT })}>DEL</button>
                    <OperationButton operation="÷" dispatch={dispatch} />
                    <OperationButton operation="%" dispatch={dispatch} />
                    <DigitButton digit="1" dispatch={dispatch} />
                    <DigitButton digit="2" dispatch={dispatch} />
                    <DigitButton digit="3" dispatch={dispatch} />
                    <OperationButton operation="*" dispatch={dispatch} />
                    <OperationButton operation="^" dispatch={dispatch} />
                    <DigitButton digit="4" dispatch={dispatch} />
                    <DigitButton digit="5" dispatch={dispatch} />
                    <DigitButton digit="6" dispatch={dispatch} />
                    <OperationButton operation="+" dispatch={dispatch} />
                    {/* <OperationButton operation="√" dispatch={dispatch} /> */}
                    <button> </button>
                    <DigitButton digit="7" dispatch={dispatch} />
                    <DigitButton digit="8" dispatch={dispatch} />
                    <DigitButton digit="9" dispatch={dispatch} />
                    <OperationButton operation="-" dispatch={dispatch} />
                    {/* <OperationButton operation="-" dispatch={dispatch} /> */}
                    <button></button>
                    <DigitButton digit="." dispatch={dispatch} />
                    <DigitButton digit="0" dispatch={dispatch} />
                    <button className='span-two' onClick={() => dispatch({ type: ACTIONS.EVAL })}>=</button>
                    <button onClick={() => dispatch({ type: ACTIONS.PRE_RES })}>PRE</button>
                    {/* <button className='span-two'>HISTORY</button> */}
                </div>
            </section>
        )
    }

    export default App;