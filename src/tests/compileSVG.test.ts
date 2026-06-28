import { describe, it, expect } from 'vitest'
import compileSVG from '../core/compileSVG'

describe('compileSVG', () => {
  it('scales circle path data without corrupting arc flags', () => {
    const svg = '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40"/></svg>'
    const result = compileSVG(svg, 200)

    expect(result).toBeDefined()
    expect(result?.d).toContain('A 80 80 0 1 0 180 100')
    expect(result?.d).toContain('A 80 80 0 1 0 20 100')
    expect(result?.d).not.toContain('A 80 80 0 2 0')
    expect(result?.w).toBe(200)
    expect(result?.h).toBe(200)
  })

  it('converts rect to path and scales coordinates correctly', () => {
    const svg = '<svg viewBox="0 0 100 100"><rect x="10" y="20" width="30" height="40"/></svg>'
    const result = compileSVG(svg, 200)

    expect(result).toBeDefined()
    expect(result?.d).toContain('M 20 40 L 80 40 L 80 120 L 20 120 Z')
    expect(result?.w).toBe(200)
    expect(result?.h).toBe(200)
  })

  it('converts ellipse to path and preserves arc flags when scaling', () => {
    const svg = '<svg viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="30" ry="20"/></svg>'
    const result = compileSVG(svg, 200)

    expect(result).toBeDefined()
    expect(result?.d).toContain('M 40 100')
    expect(result?.d).toContain('A 60 40 0 1 0 160 100')
    expect(result?.d).toContain('A 60 40 0 1 0 40 100')
    expect(result?.d).not.toContain('A 60 40 0 2 0')
  })

  it('converts line to path and scales segment endpoints', () => {
    const svg = '<svg viewBox="0 0 100 100"><line x1="10" y1="10" x2="90" y2="90"/></svg>'
    const result = compileSVG(svg, 200)

    expect(result).toBeDefined()
    expect(result?.d).toBe('M 20 20 L 180 180')
  })

  it('converts polygon to path with closing Z', () => {
    const svg = '<svg viewBox="0 0 100 100"><polygon points="10,10 90,10 50,90"/></svg>'
    const result = compileSVG(svg, 200)

    expect(result).toBeDefined()
    expect(result?.d).toContain('M 20 20 L 180 20 L 100 180 Z')
  })

  it('converts polyline to path without closing Z', () => {
    const svg = '<svg viewBox="0 0 100 100"><polyline points="10,10 90,10 50,90"/></svg>'
    const result = compileSVG(svg, 200)

    expect(result).toBeDefined()
    expect(result?.d).toContain('M 20 20 L 180 20 L 100 180')
    expect(result?.d).not.toContain('Z')
  })

  it('preserves path commands and scales numeric parameters', () => {
    const svg = '<svg viewBox="0 0 100 100"><path d="M 10 10 L 90 10 H 80 V 90 Z"/></svg>'
    const result = compileSVG(svg, 200)

    expect(result).toBeDefined()
    expect(result?.d).toContain('M 20 20')
    expect(result?.d).toContain('L 180 20')
    expect(result?.d).toContain('H 160')
    expect(result?.d).toContain('V 180')
  })

  it('uses width/height attributes when viewBox is absent', () => {
    const svg = '<svg width="80" height="40"><rect x="10" y="10" width="10" height="10"/></svg>'
    const result = compileSVG(svg)

    expect(result).toBeDefined()
    expect(result?.w).toBe(80)
    expect(result?.h).toBe(40)
    expect(result?.d).toContain('M 10 10 L 20 10 L 20 20 L 10 20 Z')
  })

  it('uses viewBox dimensions when provided', () => {
    const svg = '<svg viewBox="0 0 150 75"><rect x="0" y="0" width="10" height="10"/></svg>'
    const result = compileSVG(svg)

    expect(result).toBeDefined()
    expect(result?.w).toBe(150)
    expect(result?.h).toBe(75)
  })

  it('ignores shapes with fill="none" and stroke="none"', () => {
    const svg = '<svg viewBox="0 0 100 100"><rect x="10" y="10" width="20" height="20" fill="none" stroke="none"/></svg>'
    const result = compileSVG(svg)

    expect(result).toBeDefined()
    expect(result?.d).toBe('')
  })

  it('includes shapes with stroke only when fill="none"', () => {
    const svg = '<svg viewBox="0 0 100 100"><rect x="10" y="10" width="20" height="20" fill="none" stroke="black"/></svg>'
    const result = compileSVG(svg)

    expect(result).toBeDefined()
    expect(result?.d).toContain('M 10 10 L 30 10 L 30 30 L 10 30 Z')
  })

  it('returns undefined for undefined svg input', () => {
    const result = compileSVG(undefined)
    expect(result).toBeUndefined()
  })
})
