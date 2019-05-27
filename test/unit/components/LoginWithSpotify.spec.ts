import { mount } from '@vue/test-utils';
import LoginWithSpotify from '~/components/LoginWithSpotify.vue';

describe('LoginWithSpotify', () => {
  it('renders', () => {
    const subject = mount(LoginWithSpotify);

    expect(subject.isVueInstance()).toBeTruthy();
  });

  it('generates the proper Spotify Login URL', () => {
    const subject = mount(LoginWithSpotify, {
      propsData: {
        clientId: 'clientId',
        redirectUri: 'redirectUri'
      }
    });

    expect((subject.vm as any).authUrl).toContain('clientId');
    expect((subject.vm as any).authUrl).toContain('redirectUri');
  });
});
