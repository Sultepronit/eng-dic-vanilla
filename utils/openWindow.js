export default async function openWindow(type, inputValue) {
    const strWindowFeatures = 'location=yes,height=1200,width=500,top=0,left=1700,scrollbars=yes,status=yes';

    const URL =
        type === 'google' ? `https://translate.google.com/?sl=en&tl=uk&text=${inputValue}%0A&op=translate`
        : '';

    open(URL, '_blank', strWindowFeatures);
}