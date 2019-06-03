import Welcome from '~/components/Welcome.vue';
import { shallowMount } from '@vue/test-utils';

describe('Welcome', () => {
  it('returns', () => {
    const subject = shallowMount(Welcome);

    expect(subject.element).toMatchSnapshot();
  });
});
