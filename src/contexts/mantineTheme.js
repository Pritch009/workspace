export const theme = {
    colorScheme: 'light',
    color: {
        green: '#bfd59c',
        orange: '#E8A779',
        blue: '#3fadff',
        white: '#ffffff',
    },
    components: {
        Modal: {
            styles: {
                inner: { boxSizing: 'border-box', left: 0 }
            }
        }
    }
}

theme.color.primaryColor = theme.color.blue;