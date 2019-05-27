import { mount } from '@vue/test-utils';
import Welcome from '~/components/Welcome.vue';

describe('Welcome', () => {
  it('renders', () => {
    const subject = mount(Welcome);

    expect(subject.element).toMatchSnapshot();
  });
});
