Template.palette.rendered = function() {
    $('#color-picker').colorpicker({ 
        color: '#0000ff', 
        container: true, 
        inline: true,
        format: 'rgb',
        customClass: 'colorpicker-large',
        sliders: {
                    saturation: {
                        maxLeft: 100,
                        maxTop: 200
                    },
                    hue: {
                        maxTop: 200
                    }
        } 
    });
}