export default function AdSlot({ label = 'Ad space' }) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  if (!client) {
    return (
      <div className="ad-slot" role="note" aria-label="Advertisement placeholder">
        <p><strong>{label}</strong></p>
        <p>Ad space — ads load only after AdSense approval</p>
      </div>
    );
  }
  // Only reached once a real publisher ID is set in the environment.
  return (
    <>
      <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`} crossOrigin="anonymous"></script>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot="0000000000"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </>
  );
}
