import MyLink from "@/components/CommonComponents/MyLink";

const ForumLayout = ({ children }) => {
  return (
    <div className="h-[90%]">
      <div className="h-[10%] bg-black text-white flex items-center justify-around">
        <MyLink size="small" href="/" title="На головну" />
        <MyLink size="small" href="/" title="Публікації" />
        <MyLink size="small" href="/" title="Брейншторм" />
      </div>
      <div className="h-[90%] flex">{children}</div>
    </div>
  );
};

export default ForumLayout;
