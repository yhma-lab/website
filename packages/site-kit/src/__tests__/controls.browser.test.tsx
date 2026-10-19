import type { AttachmentSource } from '../components/view-links.tsx'

import * as stylex from '@stylexjs/stylex'
import { createRef } from 'react'
import { ButtonContext } from 'react-aria-components/Button'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { page, userEvent } from 'vitest/browser'

import { Hero } from '../components/hero.tsx'
import { ActionLink } from '../components/ui/action-link.tsx'
import { Button } from '../components/ui/button.tsx'
import { Attachments } from '../components/view-links.tsx'
import { translate } from '../content/strings.ts'

const styles = stylex.create({
  block: { display: 'inline-block' },
  override: {
    color: 'rgb(100, 20, 30)',
    opacity: 0.8,
    outlineWidth: 5,
    paddingInline: 17,
  },
  width: (width: number) => ({ inlineSize: width }),
})

const attachmentSource: AttachmentSource = {
  doi: '10.1234/example',
  links: [{ name: 'Project', url: 'https://example.com/project' }],
  slugs: ['example'],
  url_code: 'https://example.com/code',
  url_dataset: 'https://example.com/dataset',
  url_pdf: '/publication/example/paper.pdf',
  url_poster: 'https://example.com/poster',
  url_slides: 'https://example.com/slides',
  url_source: 'https://example.com/source',
  url_video: 'https://example.com/video',
}

const resolve = (url: string) => url

// These tests run with the real StyleX transform, not a mocked props() helper.
describe('Button', () => {
  it('forwards refs and presses without accidentally submitting a form', async () => {
    const ref = createRef<HTMLButtonElement>()
    const onPress = vi.fn()
    const onFocus = vi.fn()
    const onSubmit = vi.fn()
    await render(
      <form
        onSubmit={event => {
          event.preventDefault()
          onSubmit()
        }}
      >
        <Button onFocus={onFocus} onPress={onPress} ref={ref}>
          Run action
        </Button>
      </form>,
    )
    const button = page.getByRole('button', { name: 'Run action' })

    expect(ref.current).toBe(button.element())
    await expect.element(button).toHaveAttribute('type', 'button')
    await button.click()
    await userEvent.keyboard('{Enter}')
    await userEvent.keyboard(' ')

    expect(onPress).toHaveBeenCalledTimes(3)
    expect(onFocus).toHaveBeenCalled()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('preserves explicit submit buttons', async () => {
    const onSubmit = vi.fn()
    await render(
      <form
        onSubmit={event => {
          event.preventDefault()
          onSubmit()
        }}
      >
        <Button name="intent" type="submit" value="save">
          Save
        </Button>
      </form>,
    )
    const button = page.getByRole('button', { name: 'Save' })
    await expect.element(button).toHaveAttribute('type', 'submit')
    await expect.element(button).toHaveAttribute('name', 'intent')
    await expect.element(button).toHaveAttribute('value', 'save')
    await button.click()
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('preserves slotted context refs, events, labels, and button type', async () => {
    const contextRef = createRef<HTMLButtonElement>()
    const localRef = createRef<HTMLButtonElement>()
    const contextPress = vi.fn()
    const localPress = vi.fn()
    await render(
      <ButtonContext
        value={{
          slots: {
            trigger: {
              'aria-label': 'Context action',
              onPress: contextPress,
              ref: contextRef,
              type: 'submit',
            },
          },
        }}
      >
        <Button onPress={localPress} ref={localRef} slot="trigger">
          Action
        </Button>
      </ButtonContext>,
    )
    const button = page.getByRole('button', { name: 'Context action' })
    expect(contextRef.current).toBe(button.element())
    expect(localRef.current).toBe(button.element())
    await expect.element(button).toHaveAttribute('slot', 'trigger')
    await expect.element(button).toHaveAttribute('type', 'submit')
    await button.click()
    expect(contextPress).toHaveBeenCalledTimes(1)
    expect(localPress).toHaveBeenCalledTimes(1)
  })

  it('preserves custom native rendering, including access keys', async () => {
    const ref = createRef<HTMLButtonElement>()
    const onPress = vi.fn()
    await render(
      <Button
        onPress={onPress}
        ref={ref}
        render={props => <button {...props} accessKey="t" />}
      >
        Toggle theme
      </Button>,
    )
    const button = page.getByRole('button', { name: 'Toggle theme' })
    expect(ref.current).toBe(button.element())
    await expect.element(button).toHaveAttribute('accesskey', 't')
    await expect.element(button).toHaveAttribute('type', 'button')
    await button.click()
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('composes render props and retains dynamic StyleX inline variables', async () => {
    await render(
      <Button
        aria-label="Stateful"
        className={({ isHovered }) =>
          isHovered ? 'caller-class hovered' : 'caller-class'
        }
        style={({ isHovered }) => ({
          color: 'rgb(9, 8, 7)',
          marginTop: isHovered ? 9 : 3,
        })}
        xstyle={[styles.override, styles.width(137)]}
      >
        {({ isHovered, isPressed }) =>
          isPressed ? 'Pressed' : isHovered ? 'Hovered' : 'Ready'
        }
      </Button>,
    )
    const button = page.getByRole('button', { name: 'Stateful' })
    await expect.element(button).toHaveTextContent('Ready')
    await expect.element(button).toHaveClass('caller-class')
    await expect.element(button).toHaveStyle({
      color: 'rgb(9, 8, 7)',
      inlineSize: '137px',
      marginTop: '3px',
      paddingInline: '17px',
    })
    expect(button.element().style.cssText).toContain('--')

    await button.hover()
    await expect.element(button).toHaveClass('hovered')
    await expect.element(button).toHaveTextContent('Hovered')
    await expect.element(button).toHaveStyle({
      inlineSize: '137px',
      marginTop: '9px',
    })
    await button.click()
    await userEvent.keyboard('[Space>]')
    await expect.element(button).toHaveTextContent('Pressed')
    await userEvent.keyboard('[/Space]')
    await expect.element(button).toHaveTextContent('Hovered')
  })

  it('shows keyboard focus and lets xstyle override base and state styles', async () => {
    const result = await render(<Button>Focus me</Button>)
    const button = page.getByRole('button', { name: 'Focus me' })
    await userEvent.tab()
    await expect.element(button).toHaveFocus()
    await expect.element(button).toHaveAttribute('data-focus-visible')
    await expect.element(button).toHaveStyle({
      outlineOffset: '3px',
      outlineStyle: 'solid',
      outlineWidth: '2px',
    })

    await result.rerender(<Button xstyle={styles.override}>Focus me</Button>)
    await expect.element(button).toHaveStyle({
      outlineWidth: '5px',
      paddingInline: '17px',
    })
    await result.rerender(
      <Button isDisabled xstyle={styles.override}>
        Focus me
      </Button>,
    )
    await expect.element(button).toBeDisabled()
    await expect.element(button).toHaveStyle({ opacity: '0.8' })
  })

  it('keeps pending focusable and distinct from native disabled', async () => {
    const onPress = vi.fn()
    await render(
      <>
        <Button isPending onPress={onPress}>
          {({ isDisabled, isPending }) =>
            isPending && !isDisabled ? 'Working' : 'Incorrect state'
          }
        </Button>
        <Button isDisabled>Disabled</Button>
        <Button>Next</Button>
      </>,
    )
    const pending = page.getByRole('button', { name: 'Working' })
    const disabled = page.getByRole('button', { name: 'Disabled' })
    await expect.element(pending).toHaveAttribute('data-pending')
    await expect.element(pending).toHaveAttribute('aria-disabled', 'true')
    await expect.element(pending).not.toHaveAttribute('disabled')
    await expect.element(pending).not.toHaveAttribute('data-disabled')
    await expect.element(disabled).toBeDisabled()
    await expect.element(disabled).toHaveStyle({ opacity: '0.5' })

    await userEvent.tab()
    await expect.element(pending).toHaveFocus()
    await userEvent.keyboard('{Enter} ')
    expect(onPress).not.toHaveBeenCalled()
    await userEvent.tab()
    await expect
      .element(page.getByRole('button', { name: 'Next' }))
      .toHaveFocus()
  })
})

describe('ActionLink', () => {
  it('retains native navigation attributes, refs, classes, and inline styles', async () => {
    const ref = createRef<HTMLAnchorElement>()
    await render(
      <ActionLink
        className="caller-link"
        download="paper.pdf"
        href="/files/paper.pdf"
        ref={ref}
        rel="noopener noreferrer"
        style={{ color: 'rgb(9, 8, 7)' }}
        target="_blank"
        xstyle={[styles.block, styles.override, styles.width(137)]}
      >
        Download paper
      </ActionLink>,
    )
    const link = page.getByRole('link', { name: 'Download paper' })
    expect(ref.current).toBe(link.element())
    expect(link.element().tagName).toBe('A')
    await expect.element(link).toHaveAttribute('href', '/files/paper.pdf')
    await expect.element(link).toHaveAttribute('target', '_blank')
    await expect.element(link).toHaveAttribute('rel', 'noopener noreferrer')
    await expect.element(link).toHaveAttribute('download', 'paper.pdf')
    await expect.element(link).toHaveClass('caller-link')
    await expect.element(link).toHaveStyle({
      color: 'rgb(9, 8, 7)',
      inlineSize: '137px',
      paddingInline: '17px',
    })
    expect(link.element().style.cssText).toContain('--')
  })

  it('has a visible native keyboard focus indicator', async () => {
    await render(<ActionLink href="#details">Details</ActionLink>)
    const link = page.getByRole('link', { name: 'Details' })
    await userEvent.tab()
    await expect.element(link).toHaveFocus()
    await expect.element(link).toHaveStyle({
      outlineOffset: '3px',
      outlineStyle: 'solid',
      outlineWidth: '2px',
    })
  })
})

describe('action-link call sites', () => {
  it('keeps Hero URLs, visuals, and announcement accessible names', async () => {
    await render(
      <Hero
        announcement={{
          link: { text: 'Read more', url: 'https://example.com/news' },
          text: 'Research news',
        }}
        noPadding
        primaryAction={{
          icon: 'sparkles',
          text: 'Publications',
          url: '/publications/',
        }}
        resolve={resolve}
        secondaryAction={{ text: 'People', url: '/people/' }}
        text=""
        title="Research group"
      />,
    )
    const announcement = page.getByRole('link', {
      name: 'Read more',
      exact: true,
    })
    await expect
      .element(announcement)
      .toHaveAttribute('href', 'https://example.com/news')
    expect(
      announcement
        .element()
        .querySelector('[aria-hidden="true"]')
        ?.tagName.toLowerCase(),
    ).toBe('svg')
    const primary = page.getByRole('link', {
      name: 'Publications',
      exact: true,
    })
    await expect.element(primary).toHaveAttribute('href', '/publications/')
    await expect.element(primary).toHaveStyle({
      backgroundColor: 'rgb(29, 78, 216)',
      paddingBlock: '11px',
      paddingInline: '18px',
    })
    await expect
      .element(page.getByRole('link', { name: 'People', exact: true }))
      .toHaveAttribute('href', '/people/')
  })

  it('does not create an unnamed placeholder link for a text-only announcement', async () => {
    await render(
      <Hero
        announcement={{ text: 'Research news' }}
        resolve={resolve}
        text=""
        title="Research group"
      />,
    )
    expect(page.getByRole('link').elements()).toHaveLength(0)
    await expect.element(page.getByText('Research news')).toBeVisible()
  })

  it('preserves attachment order, hrefs, new-tab policy, and small sizing', async () => {
    const result = await render(
      <Attachments
        labels={translate('en').buttons}
        size="small"
        source={attachmentSource}
      />,
    )
    const links = page.getByRole('link').elements()
    expect(links.map(link => link.textContent)).toEqual([
      'PDF',
      'Cite',
      'Code',
      'Dataset',
      'Poster',
      'Slides',
      'Video',
      'Source',
      'DOI',
      'Project',
    ])
    expect(links.map(link => link.getAttribute('href'))).toEqual([
      attachmentSource.url_pdf,
      '/publications/example/cite.bib',
      attachmentSource.url_code,
      attachmentSource.url_dataset,
      attachmentSource.url_poster,
      attachmentSource.url_slides,
      attachmentSource.url_video,
      attachmentSource.url_source,
      'https://doi.org/10.1234/example',
      'https://example.com/project',
    ])
    for (const link of links) {
      expect(link.getAttribute('target')).toBe('_blank')
      expect(link.getAttribute('rel')).toBe('noopener noreferrer')
    }
    const pdf = page.getByRole('link', { name: 'PDF', exact: true })
    await expect.element(pdf).toHaveStyle({
      fontSize: '12px',
      paddingBlock: '4px',
      paddingInline: '9px',
    })
    await userEvent.tab()
    await expect.element(pdf).toHaveFocus()
    await expect
      .element(pdf)
      .toHaveStyle({ outlineStyle: 'solid', outlineWidth: '2px' })

    await result.rerender(
      <Attachments
        labels={translate('en').buttons}
        size="large"
        source={attachmentSource}
      />,
    )
    await expect.element(pdf).toHaveStyle({
      fontSize: '13px',
      paddingBlock: '8px',
      paddingInline: '12px',
    })
  })
})
