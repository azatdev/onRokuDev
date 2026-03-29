local mixins = import 'mixins/theme.libsonnet';

{
  info:
    mixins.theme() + {
      color: 'gray',
    },

  alert:
    mixins.theme('DarkRed') + {
      color: 'green',
      border: '1px solid green',
    },

  success:
    mixins.theme('DarkGreen'),
}
