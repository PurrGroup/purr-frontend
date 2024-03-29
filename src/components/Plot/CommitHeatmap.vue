<template>
  <svg class="vch__wrapper" :viewBox="viewbox" id="commit-heatmap">
    <!-- month label -->
    <g
      class="vch__months__labels__wrapper"
      :transform="monthsLabelWrapperTransform[position]"
    >
      <text
        class="vch__month__label"
        v-for="month in heatmap.firstFullWeekOfMonths"
        :key="month"
        :x="getMonthLabelPostion(month).x"
        :y="getMonthLabelPostion(month).y"
      >
        {{ lo.months[month.value] }}
      </text>
    </g>
    <!-- week day label -->
    <g
      class="vch__days__labels__wrapper"
      :transform="daysLabelWrapperTransform[position]"
    >
      <text
        class="vch__day__label"
        :x="vertical ? SQUARE_SIZE * 1 : 0"
        :y="vertical ? SQUARE_SIZE - SQUARE_BORDER_SIZE : 20"
      >
        {{ lo.days[1] }}
      </text>
      <text
        class="vch__day__label"
        :x="vertical ? SQUARE_SIZE * 3 : 0"
        :y="vertical ? SQUARE_SIZE - SQUARE_BORDER_SIZE : 44"
      >
        {{ lo.days[3] }}
      </text>
      <text
        class="vch__day__label"
        :x="vertical ? SQUARE_SIZE * 5 : 0"
        :y="vertical ? SQUARE_SIZE - SQUARE_BORDER_SIZE : 69"
      >
        {{ lo.days[5] }}
      </text>
    </g>
    <!-- legend labels -->
    <g
      class="vch__legend__wrapper"
      :transform="legendWrapperTransform[position]"
    >
      <text :x="24" :y="vertical ? 8 : SQUARE_SIZE + 1">
        {{ lo.more }}
      </text>
      <rect
        v-for="(color, index) in rangeColor.slice().reverse()"
        :key="index"
        :style="{ fill: color }"
        :width="SQUARE_SIZE - SQUARE_BORDER_SIZE"
        :height="SQUARE_SIZE - SQUARE_BORDER_SIZE"
        :x="vertical ? SQUARE_SIZE * 1.75 : SQUARE_SIZE * index"
        :y="vertical ? SQUARE_SIZE * (index + 1) : 5"
        :rx="borderRadius"
        :ry="borderRadius"
      />
      <text
        :x="24"
        :y="
          vertical
            ? SQUARE_SIZE * (rangeColor.length + 2) - SQUARE_BORDER_SIZE
            : SQUARE_SIZE + 1
        "
      >
        {{ lo.less }}
      </text>
    </g>
    <!-- day contribution -->
    <g class="vch__year__wrapper" :transform="yearWrapperTransform">
      <g
        class="vch__month__wrapper"
        v-for="(week, weekIndex) in heatmap.calendar"
        :key="weekIndex"
        :transform="getWeekPosition(weekIndex)"
      >
        <template v-for="(day, dayIndex) in week" :key="day">
          <rect
            class="vch__day__square"
            v-if="day.date < now"
            :key="dayIndex"
            :transform="getDayPosition(dayIndex)"
            :width="SQUARE_SIZE - SQUARE_BORDER_SIZE"
            :height="SQUARE_SIZE - SQUARE_BORDER_SIZE"
            :style="{ fill: rangeColor[day.colorIndex] }"
            @click="$emit('day-click', day)"
            :rx="borderRadius"
            :ry="borderRadius"
            :data-popover-template="tooltipOptions(day)"
          />
        </template>
      </g>
    </g>
  </svg>
</template>

<script>
import Heatmap from '@/utils/Heatmap';
import {
  DAYS_IN_WEEK,
  DEFAULT_LOCALE,
  DEFAULT_RANGE_COLOR,
  DEFAULT_TOOLTIP_UNIT,
  SQUARE_BORDER_RADIUS,
  SQUARE_SIZE
} from '@/config/consts';
import tippy from 'tippy.js';

export default {
  props: {
    endDate: {
      required: true
    },
    max: {
      type: Number
    },
    rangeColor: {
      type: Array,
      default: () => DEFAULT_RANGE_COLOR
    },
    values: {
      required: true,
      type: Array
    },
    locale: {
      type: Object
    },
    tooltip: {
      type: Boolean,
      default: true
    },
    tooltipUnit: {
      type: String,
      default: DEFAULT_TOOLTIP_UNIT
    },
    vertical: {
      type: Boolean,
      default: false
    },
    noDataText: {
      type: String,
      default: null
    }
  },

  data() {
    return {
      now: new Date()
    };
  },

  computed: {
    position() {
      return this.vertical ? 'vertical' : 'horizontal';
    },
    borderRadius() {
      return SQUARE_BORDER_RADIUS;
    },
    tooltipTransform() {
      return `translate(${this.tooltipX}, ${this.tooltipY})`;
    },
    heatmap() {
      return new Heatmap(this.endDate, this.values, 93, this.max);
    },
    width() {
      return {
        horizontal:
          this.LEFT_SECTION_WIDTH +
          this.SQUARE_SIZE * this.heatmap.weekCount +
          this.SQUARE_BORDER_SIZE,
        vertical:
          this.LEFT_SECTION_WIDTH +
          this.SQUARE_SIZE * DAYS_IN_WEEK +
          this.RIGHT_SECTION_WIDTH
      };
    },
    heigth() {
      return {
        horizontal:
          this.TOP_SECTION_HEIGTH +
          this.SQUARE_SIZE * DAYS_IN_WEEK +
          this.SQUARE_BORDER_SIZE +
          this.BOTTOM_SECTION_HEIGTH,
        vertical:
          this.TOP_SECTION_HEIGTH +
          this.SQUARE_SIZE * this.heatmap.weekCount +
          this.SQUARE_BORDER_SIZE
      };
    },
    viewbox() {
      return `0 0 ${this.width[this.position]} ${this.heigth[this.position]}`;
    },
    daysLabelWrapperTransform() {
      return {
        horizontal: `translate(0, ${this.TOP_SECTION_HEIGTH})`,
        vertical: `translate(${this.LEFT_SECTION_WIDTH}, 0)`
      };
    },
    monthsLabelWrapperTransform() {
      return {
        horizontal: `translate(${this.LEFT_SECTION_WIDTH}, 0)`,
        vertical: `translate(0, ${this.TOP_SECTION_HEIGTH})`
      };
    },
    legendWrapperTransform() {
      return {
        horizontal: `translate(${
          this.width[this.position] -
          this.SQUARE_SIZE * this.rangeColor.length -
          30
        }, ${this.heigth[this.position] - this.BOTTOM_SECTION_HEIGTH})`,
        vertical: `translate(${
          this.LEFT_SECTION_WIDTH + (SQUARE_SIZE + 1) * DAYS_IN_WEEK
        }, ${this.TOP_SECTION_HEIGTH + 10})`
      };
    },
    yearWrapperTransform() {
      return `translate(${this.LEFT_SECTION_WIDTH}, ${this.TOP_SECTION_HEIGTH})`;
    },

    SQUARE_BORDER_SIZE: () => SQUARE_SIZE / 6,
    SQUARE_SIZE() {
      return SQUARE_SIZE + this.SQUARE_BORDER_SIZE;
    },
    TOP_SECTION_HEIGTH() {
      return SQUARE_SIZE + SQUARE_SIZE / 2;
    },
    RIGHT_SECTION_WIDTH() {
      return this.SQUARE_SIZE * 3;
    },
    BOTTOM_SECTION_HEIGTH() {
      return SQUARE_SIZE + SQUARE_SIZE / 2;
    },
    LEFT_SECTION_WIDTH() {
      return Math.ceil(SQUARE_SIZE * 1.8);
    },

    lo() {
      if (this.locale) {
        return {
          months: this.locale.months || DEFAULT_LOCALE.months,
          days: this.locale.days || DEFAULT_LOCALE.days,
          on: this.locale.on || DEFAULT_LOCALE.on,
          less: this.locale.less || DEFAULT_LOCALE.less,
          more: this.locale.more || DEFAULT_LOCALE.more
        };
      }
      return DEFAULT_LOCALE;
    }
  },

  methods: {
    tooltipOptions(day) {
      if (this.tooltip) {
        if (day.count != null) {
          return `<b>${day.count} ${this.tooltipUnit}</b> ${this.lo.on} ${
            this.lo.months[day.date.getMonth()]
          } ${day.date.getDate()}, ${day.date.getFullYear()}`;
        } else {
          return `<b>No ${this.tooltipUnit}</b> ${this.lo.on} ${
            this.lo.months[day.date.getMonth()]
          } ${day.date.getDate()}, ${day.date.getFullYear()}`;
        }
      }
      return false;
    },
    getWeekPosition(index) {
      if (this.vertical) {
        return `translate(0, ${
          this.SQUARE_SIZE * this.heatmap.weekCount -
          (index + 1) * this.SQUARE_SIZE
        })`;
      }
      return `translate(${index * this.SQUARE_SIZE}, 0)`;
    },
    getDayPosition(index) {
      if (this.vertical) {
        return `translate(${index * this.SQUARE_SIZE}, 0)`;
      }
      return `translate(0, ${index * this.SQUARE_SIZE})`;
    },
    getMonthLabelPostion(month) {
      let position = { x: 0, y: 0 };
      position.x = this.vertical ? 3 : this.SQUARE_SIZE * month.index;
      position.y = this.vertical
        ? this.SQUARE_SIZE * this.heatmap.weekCount -
          this.SQUARE_SIZE * month.index -
          this.SQUARE_SIZE / 4
        : this.SQUARE_SIZE - this.SQUARE_BORDER_SIZE;
      return position;
    }
  },
  updated() {
    this.$nextTick(function () {
      tippy('.vch__day__square', {
        content(reference) {
          return reference.getAttribute('data-popover-template');
        },
        allowHTML: true,
        delay: [150, 50],
        placement: 'top',
        theme: 'github'
      });
    });
  }
};
</script>

<style scoped>
svg.vch__wrapper {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  line-height: 10px;
}

svg.vch__wrapper .vch__months__labels__wrapper text.vch__month__label {
  /*font-size: 10px;*/
  font-size: 6px;
}

svg.vch__wrapper .vch__days__labels__wrapper text.vch__day__label,
svg.vch__wrapper .vch__legend__wrapper text {
  /*font-size: 9px;*/
  font-size: 6px;
}

svg.vch__wrapper .vch__months__labels__wrapper text.vch__month__label,
svg.vch__wrapper .vch__days__labels__wrapper text.vch__day__label,
svg.vch__wrapper .vch__legend__wrapper text {
  fill: #767676;
}

svg.vch__wrapper rect.vch__day__square:hover {
  stroke: #555;
  stroke-width: 1px;
}

svg.vch__wrapper rect.vch__day__square:focus {
  outline: none;
}
</style>

<style>
.tippy-box[data-theme~='github'] {
  font-family: var(--site-font-family);
  background: #24292f;
  color: white;
  padding: 8px 12px;
  font-size: 12px;
  border-radius: 6px;
}
</style>
