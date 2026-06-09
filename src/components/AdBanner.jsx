import { useEffect, useRef } from 'react';

export default function AdBanner() {
  const bannerRef = useRef(null);

  useEffect(() => {
    if (bannerRef.current && !bannerRef.current.hasChildNodes()) {
      const confScript = document.createElement('script');
      confScript.type = 'text/javascript';
      confScript.text = `atOptions = {
        'key' : 'ce97c811ff54133693fbe4d922b52d48',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };`;
      
      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = 'https://outrightphiladelphia.com/ce97c811ff54133693fbe4d922b52d48/invoke.js';

      bannerRef.current.appendChild(confScript);
      bannerRef.current.appendChild(invokeScript);
    }
  }, []);

  return (
    <div className="w-full flex justify-center py-4 my-4">
      <div ref={bannerRef} className="min-h-[250px] min-w-[300px]"></div>
    </div>
  );
}
