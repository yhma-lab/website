'use client'

import type { StyleXStyles } from '@stylexjs/stylex'
import type { ComponentProps } from 'react'
import type { ButtonRenderProps } from 'react-aria-components/Button'

import * as stylex from '@stylexjs/stylex'
import { Button as AriaButton } from 'react-aria-components/Button'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'

import { controlStyles } from './control.stylex.ts'

export type ButtonProps = ComponentProps<typeof AriaButton> & {
  xstyle?: StyleXStyles
}

/** RAC owns presses, slots, refs, pending behavior, and the default button type. */
export function Button({ className, style, xstyle, ...props }: ButtonProps) {
  const stylesFor = ({ isDisabled, isFocusVisible }: ButtonRenderProps) =>
    stylex.props(
      controlStyles.button,
      isFocusVisible && controlStyles.focusVisible,
      isDisabled && controlStyles.disabled,
      xstyle,
    )

  return (
    <AriaButton
      {...props}
      className={composeRenderProps(className, (callerClassName, state) =>
        [stylesFor(state).className, callerClassName].filter(Boolean).join(' '),
      )}
      style={composeRenderProps(style, (callerStyle, state) => ({
        ...stylesFor(state).style,
        ...callerStyle,
      }))}
    />
  )
}
