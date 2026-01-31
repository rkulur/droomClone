import { footerLinks } from "../../const/footerLInks";

const FooterLinks = () => {
  return (
    <div className="px-horizontal flex justify-between py-8">
      {footerLinks.map((footerLink, idx) => (
        <div
          className="flex flex-col gap-2 text-gray-600"
          key={`${footerLink.title}${idx}`}
        >
          <h3 className="">{footerLink.title}</h3>
          {footerLink.links.map((link, idx) => (
            <div
              className="flex flex-col text-xs text-gray-500"
              key={`${link.name}${idx}`}
            >
              <a className="listLink" href={link.src}>
                {link.name}
              </a>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default FooterLinks;
