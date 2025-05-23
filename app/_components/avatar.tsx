type Props = {
  name: string;
  picture: string;
};

const Avatar = ({ name, picture }: Props) => {
  return (
    <div className="flex items-center">
      <img src={picture} className="w-8 h-8 rounded-full object-cover mr-4" alt={name} />
      <div className="text-xl font-bold">{name}</div>
    </div>
  );
};

export default Avatar; 