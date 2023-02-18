<template>
  <div class="popover" :class="`trigger-${trigger}`" tabindex="0">
    <slot></slot>
    <div class="popover-overlay"
      :class="[placement, overlayClass, { 'manual-hidden': trigger === 'manual' && !visible }]">
      <slot name="overlay"></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>

const props = withDefaults(
  defineProps<{
    visible?: boolean;
    trigger?: "hover" | "focus" | "focus-within" | 'manual';
    placement?: "top" | "bottom-left" | "bottom" | "bottom-right";
    showDelay?: string;
    hideDelay?: string;
    offset?: string;
    overlayClass?: string
  }>(),
  {
    visible: false,
    trigger: "hover",
    placement: "bottom",
    hideDelay: "0s",
    showDelay: '0.2s',
    offset: "0px",
  }
);

</script>
<style lang="scss" scoped>
.popover {
  position: relative;

  &-overlay {
    position: absolute;
    z-index: 1;
    transition: all ease-in-out 0.2s v-bind(hideDelay);

    &.top-left {
      bottom: calc(100% + v-bind(offset));
      left: 0;
    }

    &.top {
      bottom: calc(100% + v-bind(offset));
      left: 50%;
      transform: translateX(-50%);
    }

    &.top-right {
      bottom: calc(100% + v-bind(offset));
      right: 0;
    }

    &.bottom-left {
      top: calc(100% + v-bind(offset));
      left: 0;
    }

    &.bottom {
      top: calc(100% + v-bind(offset));
      left: 50%;
      transform: translateX(-50%);
    }

    &.bottom-right {
      top: calc(100% + v-bind(offset));
      right: 0;
    }
  }

  @mixin hidden {
    pointer-events: none;

    &.bottom,
    &.top {
      transform: translateX(-50%) translateY(-10px);
    }

    transform: translateY(-10px);
    opacity: 0;
  }

  @mixin visible {
    pointer-events: auto;
    transition-delay: v-bind(showDelay);

    &.bottom,
    &.top {
      transform: translateX(-50%) translateY(0);
    }

    transform: translateY(0px);
    opacity: 1;
  }

  &.trigger-hover {
    .popover-overlay {
      @include hidden();
    }

    &:hover {
      .popover-overlay {
        @include visible();
      }
    }
  }

  &.trigger-focus {
    .popover-overlay {
      @include hidden();
    }

    &:focus {
      .popover-overlay {
        @include visible();
      }
    }
  }

  &.trigger-focus-within {
    .popover-overlay {
      @include hidden();
    }

    &:focus,
    &:focus-within {
      .popover-overlay {
        @include visible();
      }
    }
  }

  &.trigger-manual {
    .manual-hidden.popover-overlay {
      @include hidden();
    }


    .popover-overlay {
      @include visible();
    }

  }
}
</style>
