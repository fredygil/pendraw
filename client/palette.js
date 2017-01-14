Template.palette.rendered = function() {
    //Set default color and last used color
    Session.set('currentColor', '#0000ff');
    Session.set('lastColor', '#0000ff');
    
    $('#color-picker').colorpicker({ 
        color: Session.get('currentColor'), 
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
    }).on('changeColor', function(e) { 
        Session.set("currentColor", e.color.toString('rgb'));
    });
}