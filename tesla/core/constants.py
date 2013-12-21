from pytz import all_timezones

from model_utils import Choices


TIMEZONES = Choices(*zip(all_timezones, all_timezones))
