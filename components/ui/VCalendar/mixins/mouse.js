import Vue from 'vue'

export type MouseHandler = (e) => any

export type MouseEvents = {
  [event]: {
    event
    passive
    capture
    once
    stop
    prevent
    button?
    result?
  }
}


export default Vue.extend({
  name: 'mouse',

  methods: {
    getDefaultMouseEventHandlers (suffix, getEvent) {
      return this.getMouseEventHandlers({
        ['click' + suffix]: { event: 'click' },
        ['contextmenu' + suffix]: { event: 'contextmenu', prevent: true, result: false },
        ['mousedown' + suffix]: { event: 'mousedown' },
        ['mousemove' + suffix]: { event: 'mousemove' },
        ['mouseup' + suffix]: { event: 'mouseup' },
        ['mouseenter' + suffix]: { event: 'mouseenter' },
        ['mouseleave' + suffix]: { event: 'mouseleave' },
        ['touchstart' + suffix]: { event: 'touchstart' },
        ['touchmove' + suffix]: { event: 'touchmove' },
        ['touchend' + suffix]: { event: 'touchend' },
      }, getEvent)
    },
    getMouseEventHandlers (events, getEvent) {
      const on = {}

      for (const event in events) {
        const eventOptions = events[event]

        if (!this.$listeners[event]) continue

        // TODO somehow pull in modifiers

        const prefix = eventOptions.passive ? '&' : ((eventOptions.once ? '~' : '') + (eventOptions.capture ? '!' : ''))
        const key = prefix + eventOptions.event

        const handler = e => {
          const mouseEvent = e
          if (eventOptions.button === undefined || (mouseEvent.buttons > 0 && mouseEvent.button === eventOptions.button)) {
            if (eventOptions.prevent) {
              e.preventDefault()
            }
            if (eventOptions.stop) {
              e.stopPropagation()
            }
            this.$emit(event, getEvent(e))
          }

          return eventOptions.result
        }

        if (key in on) {
          /* istanbul ignore next */
          if (Array.isArray(on[key])) {
            (on[key] as MouseHandler[]).push(handler)
          } else {
            on[key] = [on[key], handler] as MouseHandler[]
          }
        } else {
          on[key] = handler
        }
      }

      return on
    },
  },
})
