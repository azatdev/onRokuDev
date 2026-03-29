local colors = {
  DarkGray: { css: 'DarkGray', rgb: [169, 169, 169] },
  DarkRed: { css: 'DarkRed', rgb: [139, 0, 0] },
  DarkGreen: { css: 'DarkGreen', rgb: [0, 100, 0] },
};

local rgba(rgb, alpha) =
  'rgba(%d, %d, %d, %g)' % [rgb[0], rgb[1], rgb[2], alpha];

{
  theme(name='DarkGray')::
    local c = colors[name];
    {
      background: c.css,
      ['box-shadow']: '0 0 1px %s' % rgba(c.rgb, 0.25),
      color: '#fff',
    },
}
