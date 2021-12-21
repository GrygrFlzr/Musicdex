export const SidebarPlaylists = ({
  playlistStubs,
}: {
  playlistStubs: PlaylistStub[];
}) => {
  return playlistStubs.map((x) => {
    return <div>{x.title}</div>;
  });
};